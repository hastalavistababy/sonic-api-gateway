import { ApiGatewayConfigInterface } from './interfaces/routes.interface';
import { Application } from 'express';
export declare function ApiGatewayMiddleware(app: Application, config: ApiGatewayConfigInterface): void;
