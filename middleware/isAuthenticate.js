import jwt from "jsonwebtoken";
import { messages } from "../utils/messages.js";

export const isAuthenticate = (req, res, next) => {
    const token = req.cookies?.token;
    if(!token){
        return res.status(401).json({status: false, message: messages.UNAUTHORIZED});
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
}