import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { prismaclient } from "../lib/db.js";
import { generateToken } from "../lib/util.js";

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" });
        }
        const user = await prismaclient.User.findUnique(
            { where: { email } }
        );

        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = await prismaclient.User.create({
            data: {
                fullname,
                email,
                password: hashPassword
            },
        });

        const token = generateToken(newUser.id, res);

        return res.status(201).json({
            message: "User created successfully",
            user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email },
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }

};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prismaclient.User.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({ message: "Invalid Ceredentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Ceredentials" });
        }

        generateToken(user.id, res);

        return res.status(201).json({
            user: { id: user.id, fullName: user.fullname, email: user.email, profilepic: user.profilepic },
        });

    }
    catch (error) {
        console.log("Error in login cerendtials");
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token',
            {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "lax",
            }
        );
        res.status(200).json({ message: "Logges Out successfully" });
    }
    catch (error) {
        console.log("Error in logout");
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateprofile = async (req, res) => {
    try {
        const { profilepic } = req.body;
        const userid = req.user.id;

        if (!profilepic) {
            return res.status(400).json({ messgae: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilepic);

        const updatedUser = await prismaclient.User.update({
            where: { id: userid },
            data: { profilepic: uploadResponse.secure_url },
        });

        res.status(200).json({
            message: "Profile picture updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in checkauth", error.message);
        res.status(500).json({ message: "Internal error" });
    }
}