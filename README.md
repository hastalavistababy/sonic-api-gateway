# Sonic - Nodejs API GATEWAY 

![alt text](https://iili.io/3lSIiF.png "Sonic api gateway")

Sonic is a high-performance 100% open source, config based free API Gateway for Nodejs. All source code is available under the MIT License on GitHub.

Its core functionality is to create an API that acts as an aggregator of many microservices into single endpoints.


## Features
  * A single API that exposes many.
  * Merge the content and modify of several APIs into one.
  * Device detection (mobile, desktop).
  * HTTP Caching(Redis, memory).
  * Unlimited endpoints and backends.
  * Secure the transport.
  * Error handling.
  * URL patterns and variables
  * Request body validation
  * Use middlewares(Response, Request, Error, and your own).
  * Simple JSON configuration.

### Installing: 
This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/package/sonic-api-gateway).

Using npm:

```bash
$ npm install sonic-api-gateway --save
```
Using yarn:

```bash
$ yarn add sonic-api-gateway
```

### Example: 
Now that we have installed the Sonic API gateway module. 

Let's create a Sonic project file.

___app.js___

```js
const Sonic = require('sonic-api-gateway').Sonic

const Config = {
  port : 3014, // Server will run on port 3014 
  routes: [
    {
        endpoint: '/posts/:id', // http://localhost:3014/posts/:id
        method: 'get',
        backend: [
            {
                target: 'https://jsonplaceholder.typicode.com/posts/{id}',
                method: 'get',
                response_key : "posts",
            },
            {
                target: 'https://jsonplaceholder.typicode.com/posts',
                method: 'get',
                response_key : "all_posts",
            },
            // ...
        ]
    },
    // ...
  ]
}

new Sonic(Config);
```

Start Sonic server:

```js
 node app.js 
```

Make a GET request (as we declare in config) with CURL:

```curl -G http://localhost:3014/posts/1```


## Configuration options:
```js
{
    version: String, // Optional
    logs: Boolean, // Optional
    port : Number, // Optional, Default 3000
    debug: Boolean, // Optional, Default true, for logging
    middlewares: Array, //Optional global middlewares in the format: (req, res, next) => next(), Default []
    cache: [ // Optional
        {
            driver: String, // Required, redis | memory
            host: String, // Optional
            port: Number // Optional
        }
        // ...
    ],
    routes: [
        {
            endpoint : String, // Required, ex: "/posts"
            method : String, // Required, GET, POST, DELETE, PUT
            cache: { // Optional,
                driver: String, // Required, redis | memory,
                ttl: Number, // Optional, 1 = 1 second
            },
            params : { // Optional
                [key: String] : String
            },
            onResponse?(req: any, res: any, next: any, data: any, route: any): Function; // Optional
            onRequest?(req: any, res: any, next: any): Function; // Optional
            backend: [
                {
                    target: String, // Required, ex: "https://jsonplaceholder.typicode.com/posts"
                    method: String, // Required, GET, POST, DELETE, PUT
                    response_key: String, // Optional
                    response_status : Number, // Optional
                    onResponse?(req: any, res: any, next: any, data: any, route: any): Function, // Optional
                    auth : Boolean, // Optional
                    onError?(req, res, next, proxyRoute, error) : Function // Optional
                    params : { // Optional
                        [key: String] : String
                    },
                    body: {
                        [key: string]: 'string' | 'files' | 'any' | 'number' | 'boolean' 
                    }, // Required if request method is POST, PUT. ex: body : {name : 'string'}
                    body_method: String, // Default : rawdata. Possible: formdata, urlencoded, raw
                    headers: Object // Optional, set request header
                    childRoutes: Backend[] // Experimental
                }
            ]
        }
        // ...
    ]
}
```

# API
---
### Options: 
1. [```PORT``` - Sonic server port](#PORT)
2. [```VERSION``` - Informing client about Sonic version](#version)
3. [```DEBUG``` - Sonic debug mode](#debug)
4. [```LOGS``` - Log incoming requests info](#logs)
5. [```MIDDLEWARES``` - Middlewares](#middlewares)
6. [```CACHE``` - Caching responses](#cache)
7. [```ROUTES``` - API](#routes)
8. [```ROUTES.ENDPOINT``` - API endpoint](#routes.endpoint)
9. [```ROUTES.METHOD``` API method](#routes.method)
10. [```ROUTES.onResponse``` - Handle response](#routes.onresponse)
11. [```ROUTES.CACHE```](#routes.cache)
12. [```ROUTES.BACKEND```](#routes.baackend)
13. [```ROUTES.BACKEND.TARGET```](#routes.backend.target)
14. [```ROUTES.BACKEND.METHOD```](#routes.backend.method)
15. [```ROUTES.BACKEND.RESPONSE_KEY```](#routes.backend.response_key)
16. [```ROUTES.BACKEND.RESPONSE_STATUS```](#routes.backend.response_status)
17. [```ROUTES.BACKEND.ONRESPONSE```](#routes.backend.onresponse)
18. [```ROUTES.BACKEND.AUTH```](#routes.backend.auth)
19. [```ROUTES.BACKEND.BODY```](#routes.backend.body)
20. [```ROUTES.BACKEND.BODY_METHOD```](#routes.backend.body_method)
21. [```ROUTES.BACKEND.HEADERS```](#routes.backend.headers)
22. [```ROUTES.BACKEND.CHILD_ROUTES```](#routes.backend.child_routes)

### ```port``` - Creates Sonic server

Start a server listening for connections. It will create simple http server with express.

**Type:** *Number*
**Default:** *3000*
**Required:** *false*

**Example:**
```
new Sonic({
    port : 3014
    // ...
})
```

``` curl -G http://localhost:3014 ```

> :warning: If address allready in use server will not start

### ```version``` - Informing client for Sonic version with header

Seting response header for every response wich sending from server to client.

**Type:** *String*
**Default:** *1.0*
**Required:** *false*

**Example:**
```
new Sonic({
    version: 2.0,
    // ...
})
```

### ```debug``` - Sonic debug mode

Debug styled server actions in your node.js console. It will log incoming requests, server status, caching servers status, invalid config error 

**Type:** *Boolean*
**Default:** *true*
**Required:** *false*

**Example:**
```
new Sonic({
    debug: true
    // ...
})
```

![alt text](https://iili.io/3GFYNa.png "Sonic api gateway")

### ```logs``` - Logs incoming request into file
Save request date and client ip into the file in root directory ***_log/{date)***

**Type:** *Boolean*
**Default:** *false*
**Required:** *false*

**Example:**
```
new Sonic({
    logs : true,
    // ...
})
```

### ```middlewares``` - Express Middlewares
Use Express middlewares. 

**Type:** *Array:Function(req,res,next)*
**Default:** *none*
**Required:** *false*

**Example:**
```
new Sonic({
    middlewares: [
        (req: Request, res: Response, next: NextFunction) => {
            console.log(req.method)
            next() // Don't miss 
        },
        morgan(),
        // ...
    ]
    // ...
})
```

### ```cache``` - Caching backend response

With caching option you can cache every response to a redis or disk memory. This caching technique applies to traffic between Sonic and your microservices endpoints.

**Type:** *Array:Object ```(port?: Number, host?: String, driver: 'redis' || 'memory')```*
**Default:** *none*
**Required:** *false*
**Possible cache drivers:** *redis | memory*

**Example:**
```
new Sonic({
    cache : [
        {
            driver: 'redis',
            host: '1231.1.2.3.4',
            port: 12701
        },
        {
            driver: 'memory',
        }
    ],
    routes : [
        {
            endpoint: "/v1/test",
            method: "get",
            cache: {
                driver: "memory",
            },
            backend: [
                // ...
            ]
        },
        {
            endpoint: "/v1/test/pets",
            method: "get",
            cache: {
                driver: "redis",
            },
            backend: [
                // ...
            ]
        }
    ]
    // ...
})
```
### ```routes``` - API routes
An array of endpoint objects offered by the gateway, all the associated backends and configurations.

**Type:** *Array:Object*
**Default:** *none*
**Required:** *true*

**Example:**
```
new Sonic({
    routes : [
        {
            endpoint: "/v1/test",
            method: "get", 
            backend: [
                // ...
            ]
        },
        // ...
    ]
    // ...
})
```

### ```routes.endpoint``` - Api endpoint name
The resource URL you want to expose

**Type:** *String*
**Default:** *none*
**Required:** *true*
**Note:** *Endpoints starts with "/"*

**Example**
```
new Sonic({
    // ... 
    routes : {
        endpoint : "/v1/test-endpoint"
        // ... 
    }
    // ... 
})
```

    curl http://localhost:3014/v1/test-endpoint

### ```routes.method``` - Api request method
Request method, GET, POST, PUT or DELETE

**Type:** *String*
**Default:** *get*
**Required:** *true*
**Note:** *Possible : GET, POST, PUT, DELETE*


**Example**
```
new Sonic({
    // ...
    routes : {
        endpoint : "/v1/test-endpoint",
        method : "get"
        // ...
    }
    // ...
})
```

    curl http://localhost:1001/v1/test-endpoint

Documentation in progress.