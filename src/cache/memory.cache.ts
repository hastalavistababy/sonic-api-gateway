import NodeCache from 'node-cache';
import { Debug } from '../debug';

export class MemoryModule {
    myCache: any

    constructor(clientOpts?: any) {
        this.myCache = new NodeCache()
    }

    connect() {
        Debug(`\n⚡️[CACHE]: Memory caching is ready for use\n`.magenta.underline)
    }

    async get(key: any) {
        const result = await this.myCache.get(key)
        return result;
    }

    async set(key: any, data: any, ex: number = 0) {
        let result = await this.myCache.set(key, data, ex)
        return result;
    }

    del(key: any) {
        this.myCache.del(key)
    }
}