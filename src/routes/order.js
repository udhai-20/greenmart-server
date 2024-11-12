import { confirmOrder, createOrder, getOrders, getOrdersById, updateOrderStatus } from "../controllers/orders/order.js"
import { verifyToken } from "../middleware/auth.js";

export const orderRoutes = async (fastify, options) => {
    fastify.addHook("preHandler", async (request, reply) => {
        const isAuthenticated = await verifyToken(request, reply);
        console.log('isAuthenticated:', isAuthenticated);
        if (!isAuthenticated) return reply.code(401).send({ message: "Unauthenticated" });

    });
    fastify.post("/orders", createOrder);
    fastify.get("/orders", getOrders);
    fastify.get("/orders/:orderId", getOrdersById);
    fastify.patch("/orders/:orderId/status", updateOrderStatus);
    fastify.post("/orders/:orderId/confirm", confirmOrder);
}