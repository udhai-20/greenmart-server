import { Category } from "../../model/index.js";


export const getAllCategory = async (req, reply) => {

    try {
        const categories = await Category.find({});
        return reply.send(categories);
    } catch (err) {
        return reply.status(500).send({ message: "something went wrong", err })

    }
}