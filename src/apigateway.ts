import express, { Response, Request, NextFunction, Application } from 'express';
import _ from 'lodash';
import { URLSearchParams } from 'url';
import FormData from 'form-data';
import axios, { AxiosError, AxiosResponse } from 'axios';
import crypto from 'crypto';
import { ErrorResponse } from './error.handlers';
import {
  RoutesInterface,
  BackendRoutes,
  ApiGatewayConfigInterface,
} from './interfaces/routes.interface';
import { ApiGatewayMiddleware } from './middlewares';
import { Debug } from './debug';
import { ValidateConfig, ValidateAndModifyRoute } from './config-validation';
import { Cache } from './cache/cache.module';
import { BadResponseLog } from './logs.module';

const app: Application = express();

export class ApiGateway {
  private routes: RoutesInterface[];
  private config: ApiGatewayConfigInterface;
  private cache: any;

  constructor(config: ApiGatewayConfigInterface) {
    ValidateConfig(config)
    this.routes = config.routes;
    process.env.debug = (config.debug || _.isUndefined(config.debug) ? 'logging' : '')
    this.config = Object.assign(
      {
        middlewares: [],
        version: '1.0'
      },
      config
    );

    this.cache = new Cache(this.config)

    ApiGatewayMiddleware(app, this.config);

    this.InitGateway();

    this.startServer();
  }

  private InitGateway() {
    this.routes.forEach(async (route: RoutesInterface, i: number) => {
      this.clearCache(route)

      const routeConfig = ValidateAndModifyRoute(route);

      Debug(`#${i + 1} `.green.bold + `[GATEWAY] [${route.method.toUpperCase()}] ${route.endpoint} => ${route.backend.map(item => `${item.target}`)}\n`.blue)

      // Generate express routes
      app[routeConfig.method](routeConfig.endpoint, async (req: Request, res: Response, next: NextFunction) => {
        let log: string = `[${req.method.toUpperCase()}] ${req.hostname}${req.url} - date: ${new Date().toISOString()}, IP: ${req.ip}`
        Debug(log.green.italic)

        this.setParams(req, res, route)

        if ('cache' in route) {
          const cacheRes = await this.cache.get(route.cache.driver, this.CacheKey(req));
          if (cacheRes) {
            res.send(JSON.parse(cacheRes))
            return;
          }
        }

        this.attachRequest(req, res, next, route)

        const proxyData: any = {};

        await Promise.all(
          routeConfig.backend.map(async (proxyRoute: BackendRoutes, index: number) => {
            if (res.writableEnded) return
            let { data, response }: any = await this.makeRequest(proxyRoute, res, req, next);

            // attach on response callback
            data = await this.attachResponse(req, res, next, data, proxyRoute);

            // Check response
            data = await this.checkStatusCode(proxyRoute, response, data);

            // Attach response key
            data = await this.addKeyOnData(proxyRoute, data);

            let parentResponseData: any = data;

            if ('childRoutes' in proxyRoute) {
              const childRoutes = proxyRoute.childRoutes
              parentResponseData.child_response = {}
              await Promise.all(
                childRoutes.map(async childProxyRoute => {
                  let { data, response }: any = await this.makeRequest(childProxyRoute, res, req, parentResponseData, next);

                  // attach on response callback
                  data = await this.attachResponse(req, res, next, data, childProxyRoute);

                  // Check response
                  data = await this.checkStatusCode(childProxyRoute, response, data);

                  // Attach response key
                  data = await this.addKeyOnData(childProxyRoute, data);

                  // parentResponseData.child_response.push(data)
                  Object.assign(parentResponseData.child_response, data)
                })
              )
            }

            // if (_.isArray(parentResponseData)) {
            //   if ('data' in proxyData) {
            //     (parentResponseData as any).data(proxyData);
            //   }
            //   Object.assign(proxyData, { data: parentResponseData });
            // }
            // else {
            Object.assign(proxyData, parentResponseData);
            // }
          })
        );

        if (res.writableEnded) return;
        // Check response
        Object.assign(proxyData, await this.attachResponse(req, res, next, proxyData, route));
        // Cache response
        this.saveCache(route, this.CacheKey(req), proxyData)
        // Send response
        res.json(proxyData);
      });
    });
  }

  // Get cache key
  private CacheKey(req: Request): string {
    return crypto.createHash('sha1').update(`${req.originalUrl}/${req.method}/${JSON.stringify(req.params)}/${JSON.stringify(req.body)}`).digest('base64')
  }

  // Caching
  private async saveCache(route: RoutesInterface, key: any, data: any): Promise<void> {
    if ('cache' in route && 'driver' in route.cache) {
      if ('ttl' in route.cache) {
        await this.cache.set(route.cache.driver, key, JSON.stringify(data), route.cache.ttl);
      }
      else {
        await this.cache.set(route.cache.driver, key, JSON.stringify(data));
      }
    }
  }

  private async clearCache(route: RoutesInterface): Promise<void> {
    if ('cache' in route && 'driver' in route.cache) {
      await this.cache.del(route.cache.driver, route.endpoint)
    }
  }

  // Get reponse
  private async makeRequest(proxyRoute: BackendRoutes, res: Response, req: Request, next: NextFunction, parentResponse?: any): Promise<{}> {
    // if (typeof parentResponse == 'object') proxyRoute.parent_response = parentResponse;
    res.set(`sonic`, this.config.version);

    let requestOptions: any = this.requestOptions(proxyRoute, req, res);

    if (res.writableEnded) return {};

    const errorResponse = (reason: {}) => {
      return new ErrorResponse({
        message: 'BAD RESPONSE',
        target: proxyRoute.target,
        reason: reason,
      }, res)
    }

    let response: void | AxiosResponse = await axios(requestOptions)
      .catch((err: AxiosError) => {
        if (this.config.logs) BadResponseLog(req, { target: proxyRoute.target, content: err })

        this.attachErrorResponse(res, req, next, err, proxyRoute)

        if (err.response) {
          errorResponse({
            message: 'Client received an error response (5xx, 4xx)',
            data: err.response.data,
            statusCode: err.response.status
          })
        }
        if (err.request) {
          errorResponse({
            message: 'No response was received',
            data: err,
            statusCode: 500
          })
        }
        else {
          errorResponse({
            message: 'BAD RESPONSE',
            data: err,
          })
        }
      })

    let data = {}

    response ? data = response.data : data = {}

    return {
      data,
      response,
    };
  }

  private requestOptions(proxyRoute: BackendRoutes, req: Request, res: Response): {} {
    this.setParams(req, res, proxyRoute)

    let body: any = {};
    body = this.getBody(proxyRoute, body, req, res);
    let headers = this.requestHeaders(proxyRoute, res, req, body)

    let target = proxyRoute.target

    if (req.params) {
      let paramsKeys = Object.keys(req.params);
      paramsKeys.map(param => {
        const prm = param.toLowerCase()
        const regexPattern = new RegExp(`{${prm}}`, 'g')
        proxyRoute.params = {
          [param]: req.params[param]
        }
        target = target.toLowerCase().replace(regexPattern, req.params[prm])
      })
    }

    if (res.writableEnded) return {}

    return {
      url: target,
      method: proxyRoute.method,
      ...{ headers },
      ...('body' in proxyRoute && !proxyRoute.method.includes('get') ? { data: body } : ''),
    };
  }

  private getBody(proxyRoute: BackendRoutes, body: any, req: any, res: Response, next?: NextFunction) {
    const errorResponse = (message: string) => {
      return new ErrorResponse(
        {
          message: 'BAD ROUTE BACKEND',
          target: proxyRoute.target,
          reason: `${message}`,
        },
        res
      );
    }

    // res.send(req.body)
    if (proxyRoute.method == 'post' || proxyRoute.method == 'put' || proxyRoute.method == 'delete') {
      try {
        let proxyObjects: any = {}

        if ('body' in proxyRoute) {
          proxyObjects = Object.keys(proxyRoute.body);

          // Validate
          proxyObjects.map((item: any) => {
            let bodyItemType = proxyRoute.body[item];

            if (bodyItemType != 'any' && bodyItemType != 'files') {
              if (req.body[item] === false) errorResponse('Invalid request body [NOT FOUND]')
              if (typeof req.body[item] != bodyItemType && proxyRoute.body_method != 'urlencoded') {
                errorResponse('Invalid Request Body [TYPE ERROR]')
              }
            }

            if (bodyItemType == 'files') {
              if (req.files == null || _.isUndefined(req.files[item])) {
                errorResponse('Invalid request body [NOT FOUND]/File not found')
              }
            }
          })


          // Form data
          if (proxyRoute.body_method == 'formdata') {
            let formdata = new FormData();

            // Validate body
            proxyObjects.map((item: any) => {
              if (req.files[item]) {
                // If many files
                if (_.isArray(req.files[item])) {
                  req.files[item].map((file: any) => {
                    formdata.append(item, Buffer.from(file.data), { filename: file.name })
                  })
                }
                else {
                  formdata.append(item, Buffer.from(req.files[item].data), { filename: req.files[item].name })
                }

              }
              else {
                formdata.append(item, req.body[item])
              }
            });

            body = formdata;
          }

          // Urlencoded
          else if (proxyRoute.body_method == 'urlencoded') {
            let urlencoded = new URLSearchParams()
            proxyObjects.map((item: any) => urlencoded.append(item, req.body[item]))
            body = urlencoded
          }

          // Binary data - Not working yet
          else if (proxyRoute.body_method == 'binary') {
            let formdata = new FormData();

            formdata.append(body, Buffer.from(req.body))

            body = formdata
          }

          else {
            proxyObjects.map((item: any) => (body[item] = req.body[item]))

            body = JSON.stringify(body)
          }
        }
        else {
          proxyObjects = {}
        }

      } catch (error) {
        this.attachErrorResponse(res, req, next, error, proxyRoute);
        errorResponse(error)
      }
    }

    return body;
  }

  private requestHeaders(proxyRoute: BackendRoutes, res: Response, req: Request, body: any) {
    let headers: any = {}

    if (res.writableEnded) return;
    // headers['accept'] = 'application/json';

    if (proxyRoute.body_method == 'formdata') {
      headers['content-type'] = body.getHeaders()['content-type'];
    }
    else if (proxyRoute.body_method == 'urlencoded') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    else {
      headers['Content-Type'] = req.headers["content-type"] || 'application/json'
    }

    if (proxyRoute.headers) {
      headers = { ...proxyRoute.headers }
    }

    if (proxyRoute.auth) {
      headers.Authorization = req.headers.authorization
    }

    return headers
  }

  // Modify/check response method
  private checkStatusCode(proxyRoute: BackendRoutes, response: ResponseInit, data: any) {
    if ('response_status' in proxyRoute) {
      if (proxyRoute.response_status != response.status) {
        return {
          message: `Returnd invalid status code.`,
          error: `PROMISE ${proxyRoute.response_status} GET ${response.status}`,
          response: data,
        };
      }
    } else {
      return data;
    }
  }

  // Attack key
  private addKeyOnData(proxyRoute: BackendRoutes, data: any) {
    let haveResponseKey =
      'response_key' in proxyRoute &&
      _.isString(proxyRoute.response_key) &&
      !_.isEmpty(proxyRoute.response_key);

    if (haveResponseKey) {
      return {
        [proxyRoute.response_key]: data,
      };
    }
    return data;
  }

  // Attach response
  private attachResponse(req: Request, res: Response, next: NextFunction, data: any, route: any) {
    if (_.isFunction(route.onResponse)) {
      return route.onResponse(req, res, next, data, route);
    } else {
      return data;
    }
  }

  // Attach ErrorResponse
  private attachErrorResponse(res: Response, req: Request, next: NextFunction, error: AxiosError, proxyRoute: BackendRoutes) {
    if (_.isFunction(proxyRoute.onError)) {
      return proxyRoute.onError(req, res, next, proxyRoute, error);
    }
  }

  // Attach Request
  private attachRequest(req: Request, res: Response, next: NextFunction, proxyRoute: RoutesInterface) {
    if (_.isFunction(proxyRoute.onRequest)) {
      return proxyRoute.onRequest(req, res, next);
    }
  }

  // Set params
  private setParams(req: Request, res: Response, route: RoutesInterface | BackendRoutes) {
    if ('params' in route) {
      let routeParams = Object.keys(route.params)
      routeParams.map(param => {
        if (_.isUndefined(req.params[param])) req.params[param] = route.params[param]
      })
    }
  }

  // Start http server with express
  private startServer() {
    app.listen(this.config.port, () => {
      Debug(
        `⚡️[SERVER]: Server is running at http://localhost:${this.config.port}`
          .magenta.underline
      );
    });
  }
}