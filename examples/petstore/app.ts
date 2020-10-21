/**
 * Module dependencies.
 */
import { Sonic, SonicConfigInterface } from '../../src/index';

const Config: SonicConfigInterface = {
    port: 3001, // Default 3000
    logs: true,
    cache: [
        {
            driver: "memory",
        }
    ],
    routes: [
        {
            endpoint: "/v1/test/upload/images/:pet_id",
            method: "post",
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/pet/{pet_id}/uploadImage",
                    method: "post",
                    body_method: 'formdata',
                    body: {
                        'additionalMetadata': 'string',
                        'file': 'files'
                    }
                }
            ]
        },
        {
            endpoint: "/v1/test/pet",
            method: "post",
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/pet",
                    method: "post",
                    body: {
                        'id': 'number',
                        'category': 'any',
                        "photoUrls": 'any'
                    }
                }
            ]
        },
        {
            endpoint: "/v1/test/pet",
            method: "put",
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/pet",
                    method: "put",
                    body: {
                        'id': 'any',
                        'category': 'any',
                        "photoUrls": 'any'
                    }
                }
            ]
        },
        {
            endpoint: "/v1/test/pets/bystatys/:status",
            method: "get",
            cache: {
                driver: "memory",
            },
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/pet/findByStatus?status={status}",
                    method: "get",
                    response_key: 'sold'
                }
            ]
        },
        {
            endpoint: "/v1/test/pets/:id",
            method: "get",
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/pet/{id}",
                    method: "get",
                    response_key: 'pet'
                }
            ]
        },
        {
            endpoint: "/v1/test/pets/:id",
            method: "post",
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/pet/{id}",
                    method: "post",
                    response_key: 'pet',
                    body_method: 'urlencoded',
                    body: {
                        name: 'number',
                        status: 'number'
                    }
                }
            ]
        },
        {
            endpoint: "/v1/test/pets/:id",
            method: "delete",
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/pet/{id}",
                    method: "delete",
                    body: {
                        api_key: "any"
                    }
                }
            ]
        },
        {
            endpoint: "/v1/test/store/order",
            method: "post",
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/store/order",
                    method: "post",
                    body: {
                        "id": 'number',
                        "petId": 'number',
                        "quantity": 'number',
                        "shipDate": 'string',
                        "status": "string",
                        "complete": 'boolean'
                    }
                }
            ]
        },
        {
            endpoint: "/v1/test/store/order/:id",
            method: "get",
            cache: {
                driver: "memory",
            },
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/store/order/{id}",
                    method: "get"
                }
            ]
        },
        {
            endpoint: "/v1/test/store/order/:id",
            method: "delete",
            backend: [
                {
                    target: "https://petstore.swagger.io/v2/store/order/{id}",
                    method: "delete"
                }
            ]
        }
    ]
}

Sonic(Config);
