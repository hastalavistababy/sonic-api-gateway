"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayMiddleware = void 0;
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var express_1 = __importDefault(require("express"));
var colors = __importStar(require("colors"));
var logs_module_1 = require("./logs.module");
function ApiGatewayMiddleware(app, config) {
    app.set('trust proxy', true);
    config.middlewares.forEach(function (middleware) {
        app.use(middleware);
    });
    app.use(function (req, res, next) {
        if (config.logs)
            logs_module_1.RequestLog(req);
        next();
    });
    app.use(express_fileupload_1.default());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // check if debugger true
    if (config.debug)
        colors.enable();
}
exports.ApiGatewayMiddleware = ApiGatewayMiddleware;
