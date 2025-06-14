import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { messages } from "../utils/messages.js";

// =================== Registration ====================//
export const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ status: false, message: messages.FIELDS_REQUIRED });
        }
        // checking email is already exist or not
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ status: false, message: messages.EMAIL_EXISTS });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        //await User.create({ name,email,password})

        //generate token
        const token = jwt.sign({id:user._id, name:user.name, email: email}, process.env.JWT_SECRET_KEY, {expiresIn:'1d'});
        // store in cookies
        res.cookie('token', token, {httponly:true, secure:false, samesite:"lax", maxAge:24*60*60*1000})

        return res.status(201).json({ status: true, message: messages.REGISTRATION_SUCCESS, data: user });
    } catch (error) {
        console.log("registration failed", error);
        return res.status(500).json({ status: false, message: messages.INTERNAL_ERROR });
    }
}

// ======================= Login =======================//
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validate
        if (!email || !password) {
            return res.status(400).json({ status: false, message: messages.FIELDS_REQUIRED });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: false, message: messages.INVALID_EMAIL });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: false, message: messages.INVALID_PASSWORD });
        }

        // generate token
        const token = jwt.sign({ id: user._id, name:user.name, email: email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        // store in cookie
        res.cookie("token", token, { httponly: true, secure: false, samesite: "lax", maxAge: 24 * 60 * 60 * 1000 })

        const { password: _, ...userData } = user.toObject();

        return res.status(200).json({ status: true, message: messages.LOGIN_SUCCESS, data: userData });

    } catch (error) {
        console.log("login failed", error);
        return res.status(500).json({ status: false, message: messages.INTERNAL_ERROR });
    }
}

// ======================= Logout =======================//
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: false, samesite: "lax", maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({ status: true, message: messages.LOGOUT_SUCCESS });
    } catch (error) {
        console.log("logout failed", error);
        return res.status(200).json({ status: true, message: messages.INTERNAL_ERROR });
    }
}