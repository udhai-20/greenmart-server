import { Branch, Customer, DeliveryPartner, Order } from "../../model/index.js";


export const createOrder = async (req, reply) => {
    const { userId } = req.user;

    try {
        const { branch, items, totalPrice } = req.body;
        const customerData = await Customer.findById(userId);
        console.log('customerData:', customerData);
        const branchData = await Branch.findById(branch);
        console.log('branchData:', branchData);
        if (!customerData) return reply.status(404).send({ message: "user not found" });
        const newOrder = new Order({
            customer: userId,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                count: item.count
            })),
            branch,
            totalPrice,
            deliveryLocation: {
                latitude: customerData?.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || "No Address Found"
            },
            pickupLocation: {
                latitude: branchData?.location?.latitude,
                longitude: branchData?.location?.longitude,
                address: branchData?.address || "No Address Found"
            }
        })

        const saveOrderDetails = await newOrder.save();
        return reply.status(201).send(saveOrderDetails);

    } catch (err) {
        console.log('err:', err);
        return reply.status(500).send({ message: "Failed to create order", err });
    }

}


export const confirmOrder = async (req, reply) => {
    try {
        const { orderId } = req.params;
        console.log('orderId:', orderId)
        const { userId } = req.user;
        const { deliverPersonLocation } = req.body;
        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) return reply.status(404).send({ message: "Delivery person not found" });
        const order = await Order.findById(orderId);
        if (!order) return reply.status(404).send({ message: "Order not found" });
        if (order.status !== "available") return reply.status(400).send({ message: "order is not available" });
        order.status = "confirmed"
        order.deliveryPartner = userId;
        order.deliveryPersonLocation = {
            latitude: deliverPersonLocation?.latitude,
            longitude: deliverPersonLocation?.longitude,
            address: deliverPersonLocation?.address || ''
        }
        req.server.io.to(orderId).emit("orderConfirm",order)
        await order.save();
        return reply.send(order);
    } catch (err) {
        return reply.status(500).send({ message: "something went wrong order not confirmed yet...", err })

    }

}
export const updateOrderStatus = async (req, reply) => {
    try {
        const {orderId}=req.params;
        const {status,deliverPersonLocation}=req.body;
        const {userId}=req.user;
        console.log('orderId:', orderId);
        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) return reply.status(404).send({ message: "Delivery person not found" });
        const order = await Order.findById(orderId);
        console.log('order:', order);
        if (!order) return reply.status(404).send({ message: "Order not found" });
       
        if (["cancelled","delivered"].includes(order.status)) return reply.status(400).send({ message: "order cannot be updated" });
        if(order.deliveryPartner.toString()!==userId)return reply.status(401).send({ message: "Unauthorized" });
        order.status=status;
        order.deliveryPersonLocation=deliverPersonLocation;
        await order.save();
        req.server.io.to(orderId).emit("liveTrackingUpdate",order)
        return reply.send(order)
    } catch (err) {
        return reply.status(500).send({ message: "something went wrong failed to update order status", err })
    }

}

export const getOrders=async(req,reply)=>{
    try{

        const {status,customerId,branchId,deliveryPartnerId}=req.query;
        let query={};
        if(status){
            query["status"]=status;

        }
        if(customerId){
            query["customerId"]=customerId;
        }
        if(branchId){
            query["branchId"]=branchId;
        }
        if(deliveryPartnerId){
            query["deliveryPartner"]=deliveryPartnerId
        }
        console.log('query:', query);
        const order=await Order.find(query).populate("customer branch items.item deliveryPartner");

        return reply.send(order)


    }catch(err){
        return reply.status(500).send({ message: "something went wrong failed to get order", err })
    }
}

export const getOrdersById=async(req,reply)=>{
    try{

        const {orderId}=req.params;
       
        const order=await Order.findById(orderId).populate("customer branch items.item deliveryPartner");
        if(!order) return reply.status(404).send({message:"Order not found"});
        return reply.send(order)
    }catch(err){
        return reply.status(500).send({ message: "something went wrong failed to retrieve order", err })
    }
}