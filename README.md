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
        endpoint: '/posts/:id', // http://localhost:3014/user/:id
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

```curl -G http://localhost:3014/user/1```


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

Documentation in progress.