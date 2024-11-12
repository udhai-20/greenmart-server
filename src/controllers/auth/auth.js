import { Customer, DeliveryPartner } from "../../model/index.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    return { accessToken, refreshToken };

}

export const loginCustomer = async (req, reply) => {
    try {
        const { phone } = req.body;
        let customer = await Customer.findOne({ phone });
        if (!customer) {
            customer = new Customer({
                phone, role: "Customer", isActivated: true
            });
        }
        await customer.save();
        const { accessToken, refreshToken } = generateToken(customer);
        return reply.send({
            message: customer ? " Login Successful" : "Customer Created Successful", accessToken, refreshToken,
            customer
        })
    } catch (err) {
        return reply.status(500).send({ message: "An error occurred", err })

    }
}



export const loginDeliveryPartner = async (req, reply) => {
    try {
        const { email, password } = req.body;
        console.log('email:', email,password)
        let deliveryPartner = await DeliveryPartner.findOne({ email });
        if (!deliveryPartner) {
            return reply.status(404).send({ message: "Delivery Partner Not found" })
        }
        const isMatch = password === deliveryPartner.password;
        if (!isMatch) {
            return reply.status(404).send({ message: "Invalid Credentials" })
        }
        const { accessToken, refreshToken } = generateToken(deliveryPartner);
        return reply.send({
            message: "Login Successful",
            accessToken, refreshToken,
            deliveryPartner
        })
    } catch (err) {
        console.log(err,"error");
        return reply.status(500).send({ message: "An error occurred", err })

    }
}


export const refreshToken = async (req, reply) => {
    console.log('req:', req.body);
    const { refreshToken } = req.body;
    console.log('refreshToken:', refreshToken);

    if (!refreshToken) {
        return reply.status(401).send({ message: "Refresh Token required" });
    }
    let user;
    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        if (decode.role === "Customer") {
            user = await Customer.findById(decode.userId);
        } else if (decode.role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(decode.userId);
        }
        if (!user) {
            return reply.status(403).send({ message: "Invalid Refresh Token" });

        }
        const { refreshToken: newRefreshToken, accessToken } = generateToken(user);
        return reply.send({ message: "Token Refreshed", accessToken, refreshToken, refreshToken: newRefreshToken })
    } catch (err) {
        return reply.status(403).send({ message: "Invalid Refresh Token" })
    }

}


export const fetchUser = async (req, reply) => {
    try {
        console.log("check",req.user);
        const { userId, role } = req.user;
        let user;
        if (role === "Customer") {
            user = await Customer.findById(userId);
        } else if (role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(userId);
        };
        if (!user) {
            return reply.status(404).send({ message: "User not found", });

        };

        return reply.send({ message: "user fetched successfully",user })

    } catch (err) {
        return reply.status(500).send({ message: "something went wrong" });
    }

}

