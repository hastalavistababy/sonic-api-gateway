import { ApiGatewayConfigInterface, RoutesInterface } from './interfaces/routes.interface';
export declare const ValidateConfig: (config: ApiGatewayConfigInterface) => Promise<ApiGatewayConfigInterface>;
export declare const ValidateAndModifyRoute: (route: RoutesInterface) => RoutesInterface;
