import { Product } from "../../model/index.js";


export const getProductByCategoryId=async(req,reply)=>{
    const {categoryId}=req.params;
    try{
        const products=await Product.find({category:categoryId}).select("-category").exec();
        return reply.send(products);
    }catch(err){
        reply.status(500).send({message:"Something went wrong",err})
    };
}