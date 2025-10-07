import cloudinary from "../lib/cloudinary.js";
import { prismaclient } from "../lib/db.js";

export const getuserforsidebar = async (req, res) => {

    try {

        const loggedinuser = req.user.id;

        const filteredUsers = await prismaclient.user.findMany({
            where: {
                id: {
                    not: loggedinuser
                }
            }
        });

        res.status(200).json(filteredUsers);

    }
    catch (error) {
        console.error("Error in users", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
}

export const getmessages = async (req, res) => {
    try {
  
        const { id } = req.params;
      
        const myId = req.user.id;
  
        const messages = await prismaclient.message.findMany({
            where: {
                OR: [
                    { senderId: myId, receiverId: id },
                    { senderId: id, receiverId: myId }
                ]
            },
            orderBy: {
                createdAt: "asc"
            }
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendmessage = async (req, res) => {

    try {
        const { text, image } = req.body;
        const { id} = req.params;
        const senderId = req?.user.id;

        let imgurl;

        if (image) {

            try {
                const uploadresponse = await cloudinary.uploader.upload(image);
                imgurl = uploadresponse.secure_url;
                console.log("Uploaded image:", imgurl);
            } catch (err) {
                console.error("Cloudinary upload error:", err);
            }

        }

        const newmwssgae = await prismaclient.message.create({
            data: {
                senderId,
                receiverId: id,
                text,
                image: imgurl,
            }
        });

        res.status(201).json(newmwssgae);

    }
    catch (error) {
        console.log("Error in sendmessage ", error.message);

    }
}