import Fastify from "fastify";
import { connectDb } from "./src/config/connect.js";
import "dotenv/config"
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registeredRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";
const init = async () => {
    await connectDb(process.env.MONGO_URI)
    const app = Fastify();
    app.register(fastifyCors, {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], 
    });
    app.register(fastifySocketIO,{
        cors:{
            origin:"*"
        },
        pingInterval:10000,
        pingTimeout:5000,
        transports:["websocket"],
    })
    await registeredRoutes(app);
    await buildAdminRouter(app)
    app.listen({ port: PORT }, (err, addr) => {
        if (err) {
            console.log("check", err);
        } else {
            console.log(`server Started on the http://localhost:${admin.options.rootPath}`);
        };
    });
    app.ready().then(( )=>{
        app.io.on("connection",(socket)=>{
            console.log("A user connected ❤️");
            // sdsdsd
            socket.on("joinRoom",(orderId)=>{
                socket.join(orderId);
                console.log("😁 user Joined room",`${orderId}`)

            })
            socket.on("disconnect",()=>{
                console.log("User Disconnected 😒")
            })
        });


    })

}
init();
