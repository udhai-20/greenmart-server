import jwt from "jsonwebtoken";
export const verifyToken = (req, reply) => {
    try {
        // console.log('req:', req.headers);
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply.status(401).send({ message: "Access token required" })
        };
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decode;
          return true;
    } catch (err) {
        console.log('err:', err);
        return reply.status(403).send({ message: "Invalid or expired token." });
    };
}