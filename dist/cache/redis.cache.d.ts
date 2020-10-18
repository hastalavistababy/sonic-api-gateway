export declare class RedisModule {
    redis: any;
    constructor(clientOpts?: any);
    connect(): Promise<void>;
    get(key: any): Promise<any>;
    set(key: any, data: any, ex?: number): Promise<any>;
    del(key: any): Promise<void>;
}
