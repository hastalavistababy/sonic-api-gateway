export declare class MemoryModule {
    myCache: any;
    constructor(clientOpts?: any);
    connect(): void;
    get(key: any): Promise<any>;
    set(key: any, data: any, ex?: number): Promise<any>;
    del(key: any): void;
}
