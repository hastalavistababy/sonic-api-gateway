import { Debug } from '../debug';
import Redis from 'ioredis';

const redis = new Redis()

export class RedisModule {
    redis: any

    constructor(clientOpts?: any) {
        this.redis = new Redis(clientOpts)
    }

    async connect() {
        Debug(`\n⚡️[CACHE]: Redis server is running at ${redis.options.host}:${redis.options.port}`.magenta.underline)
        // redis.connect(() => Logger(`\n⚡️[CACHE]: Redis server is running at ${redis.options.host}:${redis.options.port}`.magenta.underline))
    }

    async get(key: any) {
        const result = await redis.get(key)

        return result;
    }

    async set(key: any, data: any, ex?: number) {
        let result
        if (ex) {
            result = await redis.setex(key, ex, data)
        }
        else {
            result = await redis.set(key, data)
        }

        return result;
    }

    async del(key: any) {
        await redis.del(key)
    }
}