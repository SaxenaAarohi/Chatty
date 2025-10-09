import express from "express";
import { getmessages, getuserforsidebar, sendmessage } from "../controller/messgae.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import uploadVideo from "../middleware/multer.js";

const router = express.Router();

router.get("/users",protectRoute,getuserforsidebar)

router.get("/:id",protectRoute,getmessages)

router.post("/send/:id",protectRoute, uploadVideo.single("video"),sendmessage);


export default router;
