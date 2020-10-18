import { ApiGateway } from "./apigateway";
import { ApiGatewayConfigInterface, RoutesInterface } from './interfaces/routes.interface'

export const Sonic = (config: ApiGatewayConfigInterface) => {
    new ApiGateway(config)
}

export interface SonicConfigInterface extends ApiGatewayConfigInterface { }

export interface SonicRouteInterface extends RoutesInterface { }
