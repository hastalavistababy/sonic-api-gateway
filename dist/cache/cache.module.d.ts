import { CacheInterface, ApiGatewayConfigInterface } from '../interfaces/routes.interface';
export declare class Cache {
    cache: CacheInterface[];
    config: ApiGatewayConfigInterface;
    redis: any;
    memory: any;
    $global: any;
    constructor(config: ApiGatewayConfigInterface);
    makeCacheConnections(): Promise<void>;
    set(driver: any, key: any, data: any, ttl?: any): Promise<any>;
    get(driver: any, key: any): Promise<any>;
    del(driver: any, key: any): Promise<void>;
}
