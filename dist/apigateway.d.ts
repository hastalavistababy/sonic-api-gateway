import { ApiGatewayConfigInterface } from './interfaces/routes.interface';
export declare class ApiGateway {
    private routes;
    private config;
    private cache;
    constructor(config: ApiGatewayConfigInterface);
    private InitGateway;
    private CacheKey;
    private saveCache;
    private clearCache;
    private makeRequest;
    private requestOptions;
    private getBody;
    private requestHeaders;
    private checkStatusCode;
    private addKeyOnData;
    private attachResponse;
    private attachErrorResponse;
    private attachRequest;
    private setParams;
    private startServer;
}
