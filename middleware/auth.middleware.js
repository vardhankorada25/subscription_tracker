import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import user from '../models/user.model.js';
const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ message: "unauthorized" })
        }
        const decode = jwt.verify(token, JWT_SECRET);
        const User = await user.findById(decode.userId)
        if (!User) { return res.status(401).json({ message: "Unauthorized" }) }
        req.user = User;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Unauthorized", error: err.message });
    }
}

export default authorize;