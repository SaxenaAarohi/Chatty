import jwt from "jsonwebtoken";
import { prismaclient } from "../lib/db.js";

export const protectRoute = async (req, res, next) => {

    try {

        const token = req.cookies.token;
    
        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized – Invalid Token" });
        }

        const user = await prismaclient.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                fullname: true,
                email: true,
                profilepic : true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
