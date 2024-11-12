import { fetchUser, loginCustomer, loginDeliveryPartner, refreshToken } from "../controllers/auth/auth.js";
import { userUpdate } from "../controllers/user/user.js";
import { verifyToken } from "../middleware/auth.js";



export const authRoutes = async (fastify, options) => {
    fastify.post("/customer/login", loginCustomer);
    fastify.post("/delivery/login", loginDeliveryPartner);
    fastify.post("/refresh-token", refreshToken);
    

}

export const userRoutes=async(fastify,options)=>{
    fastify.addHook("preHandler",async(request,reply)=>{
        const isAuthenticated = await verifyToken(request, reply);
        console.log('isAuthenticated:', isAuthenticated);
        if (!isAuthenticated) return reply.code(401).send({ message: "Unauthenticated" });

    })
    fastify.get("/user", fetchUser);
    fastify.patch("/user",  userUpdate);
}