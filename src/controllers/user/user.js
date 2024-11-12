import { Customer, DeliveryPartner } from "../../model/index.js";

export const userUpdate = async (req, reply) => {
    try {
        const { userId,role } = req.user;
        
        console.log('userId:', userId,req.user)
        const updateData = req.body;
        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);
        if (!user) return reply.status(404).send({ message: "User not found" });
        let userModel;
        if (role === "Customer") {
            userModel = Customer
        }
        else if (role === "DeliveryPartner") {
            userModel = DeliveryPartner
        }
        console.log('userModel:', userModel);
        const updateUser = await userModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true,runValidator:true });
        console.log('updateUser:', updateUser);
        if (!updateUser) return reply.status(404).send({ message: "User not found" });
        return reply.send({
            message: "User updated successfully",
            user: updateUser
        })
    } catch (err) {
        console.log("err", err);
        reply.status(500).send({ message: "something went wrong failed to update user", err })
    }

}