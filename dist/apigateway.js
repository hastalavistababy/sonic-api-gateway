"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGateway = void 0;
var express_1 = __importDefault(require("express"));
var lodash_1 = __importDefault(require("lodash"));
var url_1 = require("url");
var form_data_1 = __importDefault(require("form-data"));
var axios_1 = __importDefault(require("axios"));
var crypto_1 = __importDefault(require("crypto"));
var error_handlers_1 = require("./error.handlers");
var middlewares_1 = require("./middlewares");
var debug_1 = require("./debug");
var config_validation_1 = require("./config-validation");
var cache_module_1 = require("./cache/cache.module");
var logs_module_1 = require("./logs.module");
var app = express_1.default();
var ApiGateway = /** @class */ (function () {
    function ApiGateway(config) {
        config_validation_1.ValidateConfig(config);
        this.routes = config.routes;
        process.env.debug = (config.debug || lodash_1.default.isUndefined(config.debug) ? 'logging' : '');
        this.config = Object.assign({
            middlewares: [],
            version: '1.0',
            cache: []
        }, config);
        this.cache = new cache_module_1.Cache(this.config);
        middlewares_1.ApiGatewayMiddleware(app, this.config);
        this.InitGateway();
        this.startServer();
    }
    ApiGateway.prototype.InitGateway = function () {
        var _this = this;
        this.routes.forEach(function (route, i) { return __awaiter(_this, void 0, void 0, function () {
            var routeConfig;
            var _this = this;
            return __generator(this, function (_a) {
                this.clearCache(route);
                routeConfig = config_validation_1.ValidateAndModifyRoute(route);
                debug_1.Debug(("#" + (i + 1) + " ").green.bold + ("[GATEWAY] [" + route.method.toUpperCase() + "] " + route.endpoint + " => " + route.backend.map(function (item) { return "" + item.target; }) + "\n").blue);
                // Generate express routes
                app[routeConfig.method](routeConfig.endpoint, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                    var log, cacheRes, proxyData, _a, _b, _c;
                    var _this = this;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                log = "[" + req.method.toUpperCase() + "] " + req.hostname + req.url + " - date: " + new Date().toISOString() + ", IP: " + req.ip;
                                debug_1.Debug(log.green.italic);
                                this.setParams(req, res, route);
                                if (!('cache' in route)) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.cache.get(route.cache.driver, this.CacheKey(req))];
                            case 1:
                                cacheRes = _d.sent();
                                if (cacheRes) {
                                    res.send(JSON.parse(cacheRes));
                                    return [2 /*return*/];
                                }
                                _d.label = 2;
                            case 2:
                                this.attachRequest(req, res, next, route);
                                proxyData = {};
                                return [4 /*yield*/, Promise.all(routeConfig.backend.map(function (proxyRoute, index) { return __awaiter(_this, void 0, void 0, function () {
                                        var _a, data, response, parentResponseData, childRoutes;
                                        var _this = this;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    if (res.writableEnded)
                                                        return [2 /*return*/];
                                                    return [4 /*yield*/, this.makeRequest(proxyRoute, res, req, next)];
                                                case 1:
                                                    _a = _b.sent(), data = _a.data, response = _a.response;
                                                    return [4 /*yield*/, this.attachResponse(req, res, next, data, proxyRoute)];
                                                case 2:
                                                    // attach on response callback
                                                    data = _b.sent();
                                                    return [4 /*yield*/, this.checkStatusCode(proxyRoute, response, data)];
                                                case 3:
                                                    // Check response
                                                    data = _b.sent();
                                                    return [4 /*yield*/, this.addKeyOnData(proxyRoute, data)];
                                                case 4:
                                                    // Attach response key
                                                    data = _b.sent();
                                                    parentResponseData = data;
                                                    if (!('childRoutes' in proxyRoute)) return [3 /*break*/, 6];
                                                    childRoutes = proxyRoute.childRoutes;
                                                    parentResponseData.child_response = {};
                                                    return [4 /*yield*/, Promise.all(childRoutes.map(function (childProxyRoute) { return __awaiter(_this, void 0, void 0, function () {
                                                            var _a, data, response;
                                                            return __generator(this, function (_b) {
                                                                switch (_b.label) {
                                                                    case 0: return [4 /*yield*/, this.makeRequest(childProxyRoute, res, req, parentResponseData, next)];
                                                                    case 1:
                                                                        _a = _b.sent(), data = _a.data, response = _a.response;
                                                                        return [4 /*yield*/, this.attachResponse(req, res, next, data, childProxyRoute)];
                                                                    case 2:
                                                                        // attach on response callback
                                                                        data = _b.sent();
                                                                        return [4 /*yield*/, this.checkStatusCode(childProxyRoute, response, data)];
                                                                    case 3:
                                                                        // Check response
                                                                        data = _b.sent();
                                                                        return [4 /*yield*/, this.addKeyOnData(childProxyRoute, data)];
                                                                    case 4:
                                                                        // Attach response key
                                                                        data = _b.sent();
                                                                        // parentResponseData.child_response.push(data)
                                                                        Object.assign(parentResponseData.child_response, data);
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); }))];
                                                case 5:
                                                    _b.sent();
                                                    _b.label = 6;
                                                case 6:
                                                    // if (_.isArray(parentResponseData)) {
                                                    //   if ('data' in proxyData) {
                                                    //     (parentResponseData as any).data(proxyData);
                                                    //   }
                                                    //   Object.assign(proxyData, { data: parentResponseData });
                                                    // }
                                                    // else {
                                                    Object.assign(proxyData, parentResponseData);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }))];
                            case 3:
                                _d.sent();
                                if (res.writableEnded)
                                    return [2 /*return*/];
                                // Check response
                                _b = (_a = Object).assign;
                                _c = [proxyData];
                                return [4 /*yield*/, this.attachResponse(req, res, next, proxyData, route)];
                            case 4:
                                // Check response
                                _b.apply(_a, _c.concat([_d.sent()]));
                                // Cache response
                                this.saveCache(route, this.CacheKey(req), proxyData);
                                // Send response
                                res.json(proxyData);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    };
    // Get cache key
    ApiGateway.prototype.CacheKey = function (req) {
        return crypto_1.default.createHash('sha1').update(req.originalUrl + "/" + req.method + "/" + JSON.stringify(req.params) + "/" + JSON.stringify(req.body)).digest('base64');
    };
    // Caching
    ApiGateway.prototype.saveCache = function (route, key, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!('cache' in route && 'driver' in route.cache)) return [3 /*break*/, 4];
                        if (!('ttl' in route.cache)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cache.set(route.cache.driver, key, JSON.stringify(data), route.cache.ttl)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.cache.set(route.cache.driver, key, JSON.stringify(data))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiGateway.prototype.clearCache = function (route) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!('cache' in route && 'driver' in route.cache)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cache.del(route.cache.driver, route.endpoint)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Get reponse
    ApiGateway.prototype.makeRequest = function (proxyRoute, res, req, next, parentResponse) {
        return __awaiter(this, void 0, void 0, function () {
            var requestOptions, errorResponse, response, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if (typeof parentResponse == 'object') proxyRoute.parent_response = parentResponse;
                        res.set("sonic", this.config.version);
                        requestOptions = this.requestOptions(proxyRoute, req, res);
                        if (res.writableEnded)
                            return [2 /*return*/, {}];
                        errorResponse = function (reason) {
                            return new error_handlers_1.ErrorResponse({
                                message: 'BAD RESPONSE',
                                target: proxyRoute.target,
                                reason: reason,
                            }, res);
                        };
                        return [4 /*yield*/, axios_1.default(requestOptions)
                                .catch(function (err) {
                                if (_this.config.logs)
                                    logs_module_1.BadResponseLog(req, { target: proxyRoute.target, content: err });
                                _this.attachErrorResponse(res, req, next, err, proxyRoute);
                                if (err.response) {
                                    errorResponse({
                                        message: 'Client received an error response (5xx, 4xx)',
                                        data: err.response.data,
                                        statusCode: err.response.status
                                    });
                                }
                                if (err.request) {
                                    errorResponse({
                                        message: 'No response was received',
                                        data: err,
                                        statusCode: 500
                                    });
                                }
                                else {
                                    errorResponse({
                                        message: 'BAD RESPONSE',
                                        data: err,
                                    });
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        data = {};
                        response ? data = response.data : data = {};
                        return [2 /*return*/, {
                                data: data,
                                response: response,
                            }];
                }
            });
        });
    };
    ApiGateway.prototype.requestOptions = function (proxyRoute, req, res) {
        this.setParams(req, res, proxyRoute);
        var body = {};
        body = this.getBody(proxyRoute, body, req, res);
        var headers = this.requestHeaders(proxyRoute, res, req, body);
        var target = proxyRoute.target;
        if (req.params) {
            var paramsKeys = Object.keys(req.params);
            paramsKeys.map(function (param) {
                var _a;
                var prm = param.toLowerCase();
                var regexPattern = new RegExp("{" + prm + "}", 'g');
                proxyRoute.params = (_a = {},
                    _a[param] = req.params[param],
                    _a);
                target = target.toLowerCase().replace(regexPattern, req.params[prm]);
            });
        }
        if (res.writableEnded)
            return {};
        return __assign(__assign({ url: target, method: proxyRoute.method }, { headers: headers }), ('body' in proxyRoute && !proxyRoute.method.includes('get') ? { data: body } : ''));
    };
    ApiGateway.prototype.getBody = function (proxyRoute, body, req, res, next) {
        var errorResponse = function (message) {
            return new error_handlers_1.ErrorResponse({
                message: 'BAD ROUTE BACKEND',
                target: proxyRoute.target,
                reason: "" + message,
            }, res);
        };
        // res.send(req.body)
        if (proxyRoute.method == 'post' || proxyRoute.method == 'put' || proxyRoute.method == 'delete') {
            try {
                var proxyObjects = {};
                if ('body' in proxyRoute) {
                    proxyObjects = Object.keys(proxyRoute.body);
                    // Validate
                    proxyObjects.map(function (item) {
                        var bodyItemType = proxyRoute.body[item];
                        if (bodyItemType != 'any' && bodyItemType != 'files') {
                            if (req.body[item] === false)
                                errorResponse('Invalid request body [NOT FOUND]');
                            if (typeof req.body[item] != bodyItemType && proxyRoute.body_method != 'urlencoded') {
                                errorResponse('Invalid Request Body [TYPE ERROR]');
                            }
                        }
                        if (bodyItemType == 'files') {
                            if (req.files == null || lodash_1.default.isUndefined(req.files[item])) {
                                errorResponse('Invalid request body [NOT FOUND]/File not found');
                            }
                        }
                    });
                    // Form data
                    if (proxyRoute.body_method == 'formdata') {
                        var formdata_1 = new form_data_1.default();
                        // Validate body
                        proxyObjects.map(function (item) {
                            if (req.files[item]) {
                                // If many files
                                if (lodash_1.default.isArray(req.files[item])) {
                                    req.files[item].map(function (file) {
                                        formdata_1.append(item, Buffer.from(file.data), { filename: file.name });
                                    });
                                }
                                else {
                                    formdata_1.append(item, Buffer.from(req.files[item].data), { filename: req.files[item].name });
                                }
                            }
                            else {
                                formdata_1.append(item, req.body[item]);
                            }
                        });
                        body = formdata_1;
                    }
                    // Urlencoded
                    else if (proxyRoute.body_method == 'urlencoded') {
                        var urlencoded_1 = new url_1.URLSearchParams();
                        proxyObjects.map(function (item) { return urlencoded_1.append(item, req.body[item]); });
                        body = urlencoded_1;
                    }
                    // Binary data - Not working yet
                    else if (proxyRoute.body_method == 'binary') {
                        var formdata = new form_data_1.default();
                        formdata.append(body, Buffer.from(req.body));
                        body = formdata;
                    }
                    else {
                        proxyObjects.map(function (item) { return (body[item] = req.body[item]); });
                        body = JSON.stringify(body);
                    }
                }
                else {
                    proxyObjects = {};
                }
            }
            catch (error) {
                this.attachErrorResponse(res, req, next, error, proxyRoute);
                errorResponse(error);
            }
        }
        return body;
    };
    ApiGateway.prototype.requestHeaders = function (proxyRoute, res, req, body) {
        var headers = {};
        if (res.writableEnded)
            return;
        // headers['accept'] = 'application/json';
        if (proxyRoute.body_method == 'formdata') {
            headers['content-type'] = body.getHeaders()['content-type'];
        }
        else if (proxyRoute.body_method == 'urlencoded') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        }
        else {
            headers['Content-Type'] = req.headers["content-type"] || 'application/json';
        }
        if (proxyRoute.headers) {
            headers = __assign({}, proxyRoute.headers);
        }
        if (proxyRoute.auth) {
            headers.Authorization = req.headers.authorization;
        }
        return headers;
    };
    // Modify/check response method
    ApiGateway.prototype.checkStatusCode = function (proxyRoute, response, data) {
        if ('response_status' in proxyRoute) {
            if (proxyRoute.response_status != response.status) {
                return {
                    message: "Returnd invalid status code.",
                    error: "PROMISE " + proxyRoute.response_status + " GET " + response.status,
                    response: data,
                };
            }
        }
        else {
            return data;
        }
    };
    // Attack key
    ApiGateway.prototype.addKeyOnData = function (proxyRoute, data) {
        var _a;
        var haveResponseKey = 'response_key' in proxyRoute &&
            lodash_1.default.isString(proxyRoute.response_key) &&
            !lodash_1.default.isEmpty(proxyRoute.response_key);
        if (haveResponseKey) {
            return _a = {},
                _a[proxyRoute.response_key] = data,
                _a;
        }
        return data;
    };
    // Attach response
    ApiGateway.prototype.attachResponse = function (req, res, next, data, route) {
        if (lodash_1.default.isFunction(route.onResponse)) {
            return route.onResponse(req, res, next, data, route);
        }
        else {
            return data;
        }
    };
    // Attach ErrorResponse
    ApiGateway.prototype.attachErrorResponse = function (res, req, next, error, proxyRoute) {
        if (lodash_1.default.isFunction(proxyRoute.onError)) {
            return proxyRoute.onError(req, res, next, proxyRoute, error);
        }
    };
    // Attach Request
    ApiGateway.prototype.attachRequest = function (req, res, next, proxyRoute) {
        if (lodash_1.default.isFunction(proxyRoute.onRequest)) {
            return proxyRoute.onRequest(req, res, next);
        }
    };
    // Set params
    ApiGateway.prototype.setParams = function (req, res, route) {
        if ('params' in route) {
            var routeParams = Object.keys(route.params);
            routeParams.map(function (param) {
                if (lodash_1.default.isUndefined(req.params[param]))
                    req.params[param] = route.params[param];
            });
        }
    };
    // Start http server with express
    ApiGateway.prototype.startServer = function () {
        var _this = this;
        app.listen(this.config.port, function () {
            debug_1.Debug(("\u26A1\uFE0F[SERVER]: Server is running at http://localhost:" + _this.config.port)
                .magenta.underline);
        });
    };
    return ApiGateway;
}());
exports.ApiGateway = ApiGateway;
