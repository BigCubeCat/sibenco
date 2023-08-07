import { swOrderRoute } from "../routes/order"
import { swRouteRoute } from "../routes/route"
import { swUserRoute } from "../routes/user"
import { schema as orderSchema } from "../routes/order/schema"
import { schema as routeSchema } from "../routes/route/schema"
import { schema as userSchema } from "../routes/user/schema"

const swagger = {
    openapi: '3.0.3',
    info: {
      title: 'Express API for SGK',
      version: '1.0.0',
      description: 'The REST API for SGK service'
    },
    servers: [
      {
        url: 'http://teamhub.website:5000',
        description: 'Development server'
      }
    ],
    paths: {
        ...swOrderRoute,
        ...swRouteRoute,
        ...swUserRoute
    },
    components: {
        schemas: {
            Orders: {
                type: 'object',
                properties: {
                    orderSchema
                }
            },
            Routes: {
                type: 'object',
                properties: {
                    routeSchema
                }
            },
            Users: {
                type: 'object',
                properties: {
                    userSchema
                }
            }
        }
    }
  }
  
  export default swagger