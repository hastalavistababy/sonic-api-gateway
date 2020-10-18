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
exports.ValidateAndModifyRoute = exports.ValidateConfig = void 0;
var error_handlers_1 = require("./error.handlers");
var joi_1 = __importDefault(require("joi"));
var configSchema = joi_1.default.object({
    port: joi_1.default.number().positive().port().optional(),
    logs: joi_1.default.boolean().truthy('yes').falsy('no').optional(),
    version: joi_1.default.string().optional(),
    debug: joi_1.default.boolean().truthy('yes').falsy('no').optional(),
    middlewares: joi_1.default.array().optional(),
    cache: joi_1.default.array().optional().items({
        driver: joi_1.default.string().valid('redis', 'memory'),
        host: joi_1.default.string(),
        port: joi_1.default.number()
    }),
    routes: joi_1.default.array().required().items({
        endpoint: joi_1.default.string().required(),
        method: joi_1.default.string().required().valid('get', 'GET', 'post', 'POST', 'put', 'PUT', 'delete', 'DELETE', 'patch', 'PATCH'),
        params: joi_1.default.object(),
        onResponse: joi_1.default.function(),
        onRequest: joi_1.default.function(),
        cache: joi_1.default.object({
            driver: joi_1.default.string().valid('redis', 'memory'),
            ttl: joi_1.default.number(),
        }),
        backend: joi_1.default.array().required().items({
            target: joi_1.default.string().required(),
            method: joi_1.default.string().required().valid('get', 'GET', 'post', 'POST', 'put', 'PUT', 'delete', 'DELETE', 'patch', 'PATCH'),
            response_status: joi_1.default.number(),
            response_key: joi_1.default.string(),
            onResponse: joi_1.default.function(),
            onError: joi_1.default.function(),
            onRequest: joi_1.default.function(),
            params: joi_1.default.object(),
            auth: joi_1.default.boolean(),
            body: joi_1.default.object(),
            body_method: joi_1.default.string().valid('formdata', 'urlencoded', 'raw', 'binary'),
            headers: joi_1.default.object(),
            childRoutes: joi_1.default.any()
        })
    })
});
var BadConfigError = function (message, endpoint) {
    return new error_handlers_1.ErrorResponse({
        message: 'BAD CONFIG',
        reason: "" + message,
        isExeptionError: true
    });
};
exports.ValidateConfig = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error, value, errorName, errorEndpoint;
    return __generator(this, function (_b) {
        _a = configSchema.validate(config), error = _a.error, value = _a.value;
        if (error) {
            errorName = error.details[0].message;
            if (error.details[0].path[0] == 'routes') {
                errorEndpoint = error.details[0].context.value;
                BadConfigError(errorName, errorEndpoint);
            }
            BadConfigError(errorName);
        }
        config.routes.map(function (route, index) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!route.endpoint.startsWith('/'))
                    BadConfigError("Please start endpoint with / char", route.endpoint);
                if (route.endpoint.includes(':')) {
                    config.routes.push(route);
                    // delete config.routes[index]
                    config.routes.splice(index, 1);
                }
                route.backend.map(function (backendRoute) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (!backendRoute.target.includes('http'))
                            BadConfigError("Invalid target, Only HTTP(S) protocols are supported", backendRoute.target);
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/, config];
    });
}); };
exports.ValidateAndModifyRoute = function (route) {
    var routeConfig = __assign(__assign({ method: route.method, endpoint: route.endpoint.toLowerCase() }, ('onResponse' in route ? { onResponse: route.onResponse } : '')), { backend: route.backend.map(function (item) {
            return __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ target: item.target, method: item.method }, ('auth' in item ? { auth: item.auth, } : '')), ('auth' in item ? { auth: item.auth, } : '')), ('response_status' in item ? { response_status: item.response_status } : '')), ('response_key' in item ? { response_key: item.response_key } : '')), ('onResponse' in item ? { onResponse: item.onResponse } : '')), ('onError' in item ? { onError: item.onError } : '')), ('body' in item ? { body: item.body } : '')), ('headers' in item ? { headers: item.headers } : '')), ('params' in item ? { params: item.params } : '')), ('body_method' in item ? { body_method: item.body_method } : '')), ('childRoutes' in item ? { childRoutes: item.childRoutes } : ''));
        }) });
    return routeConfig;
};
