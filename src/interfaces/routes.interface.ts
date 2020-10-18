export interface ApiGatewayConfigInterface {
  port?: number;
  version?: string;
  logs?: boolean;
  debug?: boolean;
  middlewares?: any;
  cache?: CacheInterface[];
  routes: RoutesInterface[];
}

export interface RoutesInterface {
  endpoint: string;
  method: Methods;
  onResponse?(req: any, res: any, next: any, data: any, route: any): any;
  onRequest?(req: any, res: any, next: any): any;
  params?: {
    [key: string]: string
  };
  cache?: CacheConfig;
  backend: BackendRoutes[];
}

export interface BackendRoutes {
  target: string;
  method: Methods;
  response_key?: string;
  response_status?: number;
  onResponse?(req: any, res: any, next: any, data: any, route: any): any;
  onError?: any
  params?: {
    [key: string]: string
  };
  auth?: boolean;
  body?: {
    [key: string]: 'string' | 'files' | 'any' | 'number' | 'boolean'
  };
  body_method?: BodyMethods;
  headers?: object;
  childRoutes?: BackendRoutes[]
}

// (route: any, data: any, req: any, res: any, next: any)

export interface CacheConfig {
  driver: CacheDrivers,
  ttl?: number
}

export interface CacheInterface {
  driver: CacheDrivers,
  port?: number,
  host?: string
}

export type Methods = 'get' | 'post' | 'delete' | 'put' | 'patch';
export type CacheDrivers = 'redis' | 'memory';
export type BodyMethods = 'formdata' | 'urlencoded' | 'raw' | 'binary';