import { authRoutes, userRoutes } from "./auth.js"
import { orderRoutes } from "./order.js";
import { categoryRoutes, productRoutes } from "./product.js"
const prefix = "/api"
export const registeredRoutes = async (fastify) => {
    fastify.register(authRoutes, { prefix: prefix });
    fastify.register(userRoutes,{prefix:prefix});
    fastify.register(productRoutes, { prefix: prefix });
    fastify.register(categoryRoutes, { prefix: prefix });
    fastify.register(orderRoutes, { prefix: prefix });
}