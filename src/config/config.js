import "dotenv/config"
import fastifySession from "@fastify/session"
import connectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../model/index.js";

const MongoDBStore = connectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "session"
});

sessionStore.on("error", (error) => {
    console.log("error", error);
})

export const authenticate = async (email, password) => {
    console.log('email:', email,password)
    if (email && password) {
        const isAdminPresent = await Admin.findOne({ email })
        if (!isAdminPresent) {
            return null;
        }
        if (isAdminPresent.password === password) {
            return Promise.resolve({ email, password });
        };
    }
    else {
        return null
    }
    return null;
}

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD 
