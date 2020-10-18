
# API
---
### Options: 
1. [```PORT``` - Creates NodeWay server](#PORT)
2. [```VERSION``` - Informing client for NodeWay version](version)
3. [```DEBUG``` - NodeWay debug mode](#debug)
4. [```LOGS``` - Log incoming request info](#logs)
5. [```MIDDLEWARES``` - Express application middlewares](#middlewares)
6. [```CACHE``` - Caching responses](#cache)
7. [```ROUTES``` - API routes](#routes)
8. [```ROUTES.ENDPOINT``` - Api endpoint name](#routes.endpoint)
9. [```ROUTES.METHOD``` - Api request method](#routes.method)
10. [```ROUTES.onResponse``` - ](#routes.onresponse)
11. [```ROUTES.CACHE``` - ](#routes.cache)
12. [```ROUTES.BACKEND``` - API routes backend services](#routes.baackend)
13. [```ROUTES.BACKEND.TARGET``` - ](#routes.backend.target)
14. [```ROUTES.BACKEND.METHOD``` - ](#routes.backend.method)
15. [```ROUTES.BACKEND.RESPONSE_KEY``` - ](#routes.backend.response_key)
16. [```ROUTES.BACKEND.RESPONSE_STATUS``` - ](#routes.backend.response_status)
17. [```ROUTES.BACKEND.ONRESPONSE``` - ](#routes.backend.onresponse)
18. [```ROUTES.BACKEND.AUTH``` - ](#routes.backend.auth)
19. [```ROUTES.BACKEND.BODY``` - ](#routes.backend.body)
20. [```ROUTES.BACKEND.BODY_METHOD``` - ](#routes.backend.body_method)
21. [```ROUTES.BACKEND.HEADERS``` - ](#routes.backend.headers)
22. [```ROUTES.BACKEND.CHILD_ROUTES``` - ](#routes.backend.child_routes)

### ```port``` - Creates NodeWay server

Start a server listening for connections. It will create simple http server with express.

**Type:** *Number*
**Default:** *3000*
**Required:** *false*

**Config example**
```
NodeWay({
    port : 1001
    // require options
})
```

    curl http://localhost:1001

> :warning: If address allready in use server will not start

### ```version``` - Informing client for NodeWay version

Seting response header for every response wich sending from server to client.

**Type:** *String*
**Default:** *1.0*
**Required:** *false*

**Config example**
```
NodeWay({
    ...........
    version: 2.0,
    ...........
})
```

    curl -I http://localhost:1001


### ```debug``` - NodeWay debug mode

Debug styled server actions in your node.js console. It will log incoming requests, server status, caching servers status, invalid config error 

**Type:** *Boolean*
**Default:** *true*
**Required:** *false*

**Config example**
```
NodeWay({
    ...............
    debug: true
    ...............
})
```

### ```logs``` - Log incoming request info
Save request date and request ip into the file in root directory named _log/{date)

**Type:** *Boolean*
**Default:** *false*
**Required:** *false*

**Config example**
```
NodeWay({
    ...........
    logs : true,
    ...........
})
```

    curl http://localhost:1001/v1/test-endpoint

### ```middlewares``` - Express application middlewares
Middleware mode. Use as a middleware in ExpressJS Application

**Type:** *Array:Function(req,res,next)*
**Default:** *none*
**Required:** *false*

**Config example**
```
NodeWay({
    ................
    middlewares: [
        (req: any, res: any, next: any) => {
            console.log(req.method)
            next() // Don't miss it
        },
        morgan(),
        // ...
    ],
    ...............
})
```

### ```cache``` - Cache json response 
With caching option you can cache every get method response to a Nosql database

**Type:** *Array:Object ```(port?: Number, host?: String, driver: 'redis' || 'memory')```*
**Default:** *none*
**Required:** *false*
**Possible cache drivers:** *redis | memory*

**Config example**
```
NodeWay({
    ...........
    cache : [
        {
            driver: 'redis',
            host: '1231.1.2.3.4',
            port: 12701
        }
    ]
    ...........
})
```

Or you can use mutli caching system
**Config example**
```
NodeWay({
    ...........
    cache : [
        {
            driver: 'redis',
            host: '1231.1.2.3.4',
            port: 12701
        },
        {
            driver: 'memory',
        }
    ]
    ...........
})
```

### ```routes``` - API routes
An array of endpoint objects offered by the gateway and all the associated backends and configurations.

**Type:** *Array:Object*
**Default:** *none*
**Required:** *true*


**Config example**
```
NodeWay({
    ...........
    routes : [
        cache : [
            {
                driver: "redis",
            },
            {
                driver: "memory",
            }
        ]
        {
            endpoint: `/fake-api/todos`,
            method: 'get',
            cache: {
                driver: 'redis',
                ttl: 1000 // secods
            },
            backend: [
                {
                    target: 'https://jsonplaceholder.typicode.com/todos',
                    method: 'get',
                    response_key: 'todos',
                }
            ]
        },
        {
            endpoint: `/fake-api/users`,
            method: 'get',
            cache: {
                driver: 'memory',
                ttl: 1000 // secods
            },
            backend: [
                {
                    target: 'https://jsonplaceholder.typicode.com/users',
                    method: 'get',
                    response_key: 'users',
                }
            ]
        },
    ]
    ...........
})
```

### ```routes.endpoint``` - Api endpoint name
The resource URL you want to expose

**Type:** *String*
**Default:** *none*
**Required:** *true*
**Note:** *Endpoints starts with "/"*


**Config example**
```
NodeWay({
    ...........
    routes : {
        endpoint : "/v1/test-endpoint"
        ...
    }
    ...........
})
```

    curl http://localhost:1001/v1/test-endpoint

### ```routes.method``` - Api request method
Must be GET, POST, PUT or DELETE

**Type:** *String*
**Default:** *get*
**Required:** *true*
**Note:** *Possible : GET, POST, PUT, DELETE*


**Config example**
```
NodeWay({
    ...........
    routes : {
        endpoint : "/v1/test-endpoint",
        method : "get"
        ...
    }
    ...........
})
```

    curl http://localhost:1001/v1/test-endpoint