import { ApiGatewayConfigInterface, BackendRoutes, Methods, RoutesInterface } from './interfaces/routes.interface';
import { ErrorResponse } from './error.handlers';
import _ from 'lodash';
import Joi from 'joi';

const configSchema = Joi.object({
    port: Joi.number().positive().port().optional(),
    logs: Joi.boolean().truthy('yes').falsy('no').optional(),
    version: Joi.string().optional(),
    debug: Joi.boolean().truthy('yes').falsy('no').optional(),
    middlewares: Joi.array().optional(),
    cache: Joi.array().optional().items({
        driver: Joi.string().valid('redis', 'memory'),
        host: Joi.string(),
        port: Joi.number()
    }),
    routes: Joi.array().required().items({
        endpoint: Joi.string().required(),
        method: Joi.string().required().valid('get', 'GET', 'post', 'POST', 'put', 'PUT', 'delete', 'DELETE', 'patch', 'PATCH'),
        params: Joi.object(),
        onResponse: Joi.function(),
        onRequest: Joi.function(),
        cache: Joi.object({
            driver: Joi.string().valid('redis', 'memory'),
            ttl: Joi.number(),
        }),
        backend: Joi.array().required().items({
            target: Joi.string().required(),
            method: Joi.string().required().valid('get', 'GET', 'post', 'POST', 'put', 'PUT', 'delete', 'DELETE', 'patch', 'PATCH'),
            response_status: Joi.number(),
            response_key: Joi.string(),
            onResponse: Joi.function(),
            onError: Joi.function(),
            onRequest: Joi.function(),
            params: Joi.object(),
            auth: Joi.boolean(),
            body: Joi.object(),
            body_method: Joi.string().valid('formdata', 'urlencoded', 'raw', 'binary'),
            headers: Joi.object(),
            childRoutes: Joi.any()
        })
    })
})

const BadConfigError = (message: string, endpoint?: string): ErrorResponse => {
    return new ErrorResponse({
        message: 'BAD CONFIG',
        reason: `${message}`,
        isExeptionError: true
    });
}

export const ValidateConfig = async (config: ApiGatewayConfigInterface): Promise<ApiGatewayConfigInterface> => {
    const { error, value } = configSchema.validate(config);

    if (error) {
        const errorName = error.details[0].message;
        if (error.details[0].path[0] == 'routes') {
            const errorEndpoint = error.details[0].context.value;
            BadConfigError(errorName, errorEndpoint)
        }
        BadConfigError(errorName)
    }

    config.routes.map(async (route: RoutesInterface, index: number) => {
        if (!route.endpoint.startsWith('/')) BadConfigError(`Please start endpoint with / char`, route.endpoint)

        if (route.endpoint.includes(':')) {
            config.routes.push(route)
            // delete config.routes[index]
            config.routes.splice(index, 1)
        }

        route.backend.map(async (backendRoute: BackendRoutes) => {
            if (!backendRoute.target.includes('http')) BadConfigError(`Invalid target, Only HTTP(S) protocols are supported`, backendRoute.target)
        })
    })

    return config;
}

export const ValidateAndModifyRoute = (route: RoutesInterface) => {
    const routeConfig: RoutesInterface = {
        method: route.method,
        endpoint: route.endpoint.toLowerCase(),
        ...('onResponse' in route ? { onResponse: route.onResponse } : ''),
        backend: route.backend.map((item: BackendRoutes) => {
            return {
                target: item.target,
                method: item.method,
                ...('auth' in item ? { auth: item.auth, } : ''),
                ...('auth' in item ? { auth: item.auth, } : ''),
                ...('response_status' in item ? { response_status: item.response_status } : ''),
                ...('response_key' in item ? { response_key: item.response_key } : ''),
                ...('onResponse' in item ? { onResponse: item.onResponse } : ''),
                ...('onError' in item ? { onError: item.onError } : ''),
                ...('body' in item ? { body: item.body } : ''),
                ...('headers' in item ? { headers: item.headers } : ''),
                ...('params' in item ? { params: item.params } : ''),
                ...('body_method' in item ? { body_method: item.body_method } : ''),
                ...('childRoutes' in item ? { childRoutes: item.childRoutes } : ''),
            };
        }),
    };

    return routeConfig;
}