import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify"
import * as AdminJSMongoose from "@adminjs/mongoose"
import * as Models from "../model/index.js"
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import {dark,light,noSidebar} from "@adminjs/themes"




AdminJS.registerAdapter(AdminJSMongoose);

export const admin=new AdminJS({
    resources:[
        {
            resource:Models.Customer,
            Options:{
                lisProperties:["phone","role","isActivated"],
                filterProperties:["phone","role"]
            }
        },
        {
            resource:Models.DeliveryPartner,
            Options:{
                lisProperties:["email","role","isActivated"],
                filterProperties:["email","role"]
            }
        },
        {
            resource:Models.Admin,
            Options:{
                lisProperties:["email","role","isActivated"],
                filterProperties:["email","role"]
            }
        },
        {
            resource:Models.Branch,
            
        },
        {
            resource:Models.Product,
            
        },
        {
            resource:Models.Category,
            
        },
        {
            resource:Models.Order,
            
        },
        {
            resource:Models.Counter,
            
        }
    ],
    branding:{
        companyName:"GreenMart",
        withMadeWithLove:false,
        favicon:"https://res.cloudinary.com/dgybyhxrh/image/upload/v1730817504/btynr68g7uqmhrpr3dvl.jpg",
        logo:"https://res.cloudinary.com/dgybyhxrh/image/upload/v1730817504/btynr68g7uqmhrpr3dvl.jpg"
    },
    defaultTheme:dark.id,
    availableThemes:[dark,light,noSidebar],
    rootPath:"/admin"
    
})

export const buildAdminRouter=async(app)=>{
    await AdminJSFastify.buildAuthenticatedRouter(admin,{
        authenticate,
        cookiePassword:COOKIE_PASSWORD,
        cookieName:"adminJs"
    },app,{
        store:sessionStore,
        saveUninitialized:true,
        secrete:COOKIE_PASSWORD,
        cookie:{
            httpOnly:process.env.NODE_ENV==="production",
            secure:process.env.NODE_ENV==="production",
  
        }
        
    })

}

