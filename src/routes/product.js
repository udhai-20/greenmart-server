import { getAllCategory } from "../controllers/product/catagory.js";
import { getProductByCategoryId } from "../controllers/product/product.js";

export const productRoutes = async(fastify, options) => {
    fastify.get("/products/:categoryId", getProductByCategoryId)

};
export const categoryRoutes = async(fastify, options) => {
    fastify.get("/categories", getAllCategory);
};