export declare class RedisModule {
    redis: any;
    constructor(clientOpts?: any);
    connect(): Promise<void>;
    get(key: any): Promise<string>;
    set(key: any, data: any, ex?: number): Promise<string>;
    del(key: any): Promise<void>;
}
