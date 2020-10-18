import { Debug } from '../debug';
import Redis from 'ioredis';



export class RedisModule {
    redis = new Redis()

    constructor(clientOpts?: any) {
        this.redis = new Redis(clientOpts)
    }

    async connect() {
        Debug(`\n⚡️[CACHE]: Redis server is running at ${this.redis.options.host}:${this.redis.options.port}`.magenta.underline)
        // redis.connect(() => Logger(`\n⚡️[CACHE]: Redis server is running at ${redis.options.host}:${redis.options.port}`.magenta.underline))
    }

    async get(key: any) {
        const result = await this.redis.get(key)

        return result;
    }

    async set(key: any, data: any, ex?: number) {
        let result
        if (ex) {
            result = await this.redis.setex(key, ex, data)
        }
        else {
            result = await this.redis.set(key, data)
        }

        return result;
    }

    async del(key: any) {
        await this.redis.del(key)
    }
}