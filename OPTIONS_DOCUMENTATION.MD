
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