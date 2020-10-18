import { CacheInterface, ApiGatewayConfigInterface } from '../interfaces/routes.interface';

import { RedisModule } from './redis.cache';
import { MemoryModule } from './memory.cache';

export class Cache {
    public cache: CacheInterface[];
    public config: ApiGatewayConfigInterface;
    redis: any;
    memory: any;

    $global: any = this;

    constructor(config: ApiGatewayConfigInterface) {
        this.config = config;
        this.cache = config.cache;

        if (this.cache) {
            this.makeCacheConnections()
        }
    }

    async makeCacheConnections() {
        this.cache.forEach(async (item) => {
            if (item.driver == 'redis') {
                this.redis = new RedisModule(item)
                this.redis.connect()
            }
            else if (item.driver == 'memory') {
                this.memory = new MemoryModule(item)
                this.memory.connect()
            }
        })
    }

    public async set(driver: any, key: any, data: any, ttl?: any) {
        return await this.$global[driver].set(key, data, ttl)
    }

    public async get(driver: any, key: any) {
        const result = await this.$global[driver].get(key)
        return result
    }

    public async del(driver: any, key: any) {
        await this.$global[driver].del(key)
    }
}