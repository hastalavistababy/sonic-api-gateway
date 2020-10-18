# Sonic - Simple Nodejs API GATEWAY
___

[logo]: https://a.radikal.ru/a09/2009/6d/28123cd565be.png "Api Gateway"

Sonic is a high-performance 100% open source, config based free API Gateway for Nodejs.All source code is available under the MIT License on GitHub.

Its core functionality is to create an API that acts as an aggregator of many microservices into single endpoints.

### Usage: 

```js
import Sonic from 'api-gateway';

Sonic({
  port : 3014,
  routes: [
    {
        endpoint: '/user:id',
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
});
```

## Features
  * A single API that exposes many.
  * Merge the content and modify of several APIs into one.
  * Device detection (mobile, desktop).
  * Multi Caching(redis, memory).
  * Simple JSON configuration.
  * Secure the transport.
  * Error handling
  * Request body validation
  * Use middlewares.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.


```bash
npm install sonic-api-gateway
```

## Configuration options
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

Dcoumentation in progress.