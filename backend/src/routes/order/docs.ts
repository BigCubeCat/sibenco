import { schema } from "./schema"

export const swGetOrder = {
    "summary": "order info",
    "description": "Getting info about order",
    "tags": [
        "order",
        "специалист АХО"
    ],
    "parameters": [
        {
            "name": "orderId",
            "in": "path",
            "description": "ID of order to return",
            "required": true,
            "schema": {
                "type": "integer",
                "format": "int64"
            },
        }
    ],
    "operationId": "getOrder",
    "responses": {
        "200": {
            "description": "Done",
            "content": {
                "application/json": {
                    "schema": {
                        ...schema
                    }
                }
            }
        },
        "default": {
            "description": "Something went wrong!"
            // Add some different errors
        }
    }
}

export const swGetAllOrders = {
    "summary": "orders info",
    "description": "Getting info about all orders",
    "tags": [
        "order",
        "специалист АХО"
    ],
    "operationId": "getAllOrders",
    "responses": {
        "200": {
            "description": "Done",
            "content": {
                "application/json": {
                    "schema": {
                        ...schema
                    }
                }
            }
        },
        "default": {
            "description": "Something went wrong!"
            // Add some different errors
        }
    }
}

export const swDeleteOrder = {
    "summary": "delete order",
    "description": "Delete order",
    "tags": [
        "order",
        "специалист АХО",
        "ответственный сотрудник"
    ],
    "parameters": [
        {
            "name": "orderId",
            "in": "path",
            "description": "ID of order to delete",
            "required": true,
            "schema": {
                "type": "integer",
                "format": "int64"
            },
        }
    ],
    "operationId": "deleteOrder",
    "responses": {
        "200": {
            "description": "Done",
        },
        "default": {
            "description": "Something went wrong!"
            // Add some different errors
        }
    }
}

export const swPatchOrder = {
    "summary": "patch order",
    "description": "Change order info",
    "tags": [
        "order",
        "специалист АХО"
    ],
    "requestBody": {
            "content": {
            "application/json": {
                "schema": {
                    ...schema
                }
            }
        }
    },
    "parameters": [
        {
            "name": "orderId",
            "in": "path",
            "description": "ID of order to patch",
            "required": true,
            "schema": {
                "type": "integer",
                "format": "int64"
            },
        }
    ],
    "operationId": "patchOrder",
    "responses": {
        "200": {
            "description": "Done",
        },
        "default": {
            "description": "Something went wrong!"
            // Add some different errors
        }
    }
}

export const swFindByTags = {
    "summary": "orders by different tags",
    "description": "Getting orders by some tag",
    "tags": [
        "order",
        "специалист АХО"
    ],
    "parameters": [
        {
            "name": "tags",
            "in": "path",
            "description": "Tags to filter by",
            "required": false,
            "explode": true,
            "schema": {
                "type": "string",
                "enum": [
                    "client",
                    "date",
                    "type_of_transportation",
                    "loadin_adress",
                    "unloading_adress"
                ]
            },
        }
    ],
    "operationId": "findByTags",
    "responses": {
        "200": {
            "description": "Done",
            "content": {
                "application/json": {
                    "schema": {
                        ...schema
                    }
                }
            }
        },
        "default": {
            "description": "Something went wrong!"
            // Add some different errors
        }
    }
}

export const swFindSimilarOrders = {
    "summary": "similar orders",
    "description": "Find similar orders",
    "tags": [
        "order",
        "специалист АХО"
    ],
    "parameters": [
        {
          "name": "orderID",
          "in": "path",
          "schema": {
            "type": "integer",
            "format": "int64"
          },
          "required": true
        }
    ],
    "operationId": "findSimilarOrders",
    "responses": {
        "200": {
            "description": "Done",
            "content": {
                "application/json": {
                    "schema": {
                        ...schema
                    }
                }
            }
        },
        "default": {
            "description": "Something went wrong!"
            // Add some different errors
        }
    }
}

export const swCreateOrder = {
    "summary": "create order",
    "description": "Add a new order",
    "tags": [
        "order",
        "ответственный сотрудник"
    ],
    "operationId": "createOrder",
    "requestBody": {
        "description": "Create a new order",
        "content": {
            "application/json": {
                "schema": {
                    ...schema
                }
            }
        }
    },
    "responses": {
        "200": {
            "description": "Done",
        },
        "default": {
            "description": "Something went wrong!"
            // Add some different errors
        }
    }
}