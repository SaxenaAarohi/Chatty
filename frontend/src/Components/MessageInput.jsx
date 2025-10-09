"use client"
import { sendMessage } from "../store/thunks";
import 'emoji-picker-element';
import { Image, Send, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
export default function MessageInput() {

    const dispatch = useDispatch();

    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [videopreview, setVideoPreview] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const authUser = useSelector((state) => state.auth.user);
    const selectedUser = useSelector((state) => state.chat.selectedUser);

    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);


    useEffect(() => {
        if (!showEmojiPicker) return;

        const picker = emojiPickerRef.current;

        if (picker) {
            const handleEmojiClick = (event) => {
                setText((prev) => prev + event.detail.unicode);
                setShowEmojiPicker(false);
            };

            const handleClickOutside = (event) => {
                if (picker && !picker.contains(event.target)) {
                    setShowEmojiPicker(false);
                }
            };

            picker.addEventListener('emoji-click', handleEmojiClick);

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                picker.removeEventListener('emoji-click', handleEmojiClick);
            };
        }

    }, [showEmojiPicker]);



    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!text.trim() && !imagePreview && !videopreview) return;

        try {

            await dispatch(sendMessage(
                {
                    text: text.trim(),
                    image: imagePreview,
                    video: videoFile,
                }
            ));

            setText("");
            setImagePreview(null);
            setVideoPreview(null);

            if (fileInputRef.current) fileInputRef.current.value = "";

        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    useEffect(() => {
        return () => {
            if (videopreview) {
                URL.revokeObjectURL(videopreview);
            }
        };
    }, [videopreview]);

    const handleMediaChange = (e) => {

        const file = e.target.files[0];

        const isimage = file?.type?.startsWith("image/");
        const isvideo = file?.type?.startsWith("video/");

        if (!isimage && !isvideo) {
            toast.error("Please select an image or video file");
            return;
        }

        if (isimage) {

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        else if (isvideo) {

            const url = URL.createObjectURL(file);
            setVideoPreview(url);;
            setVideoFile(file);


        }
        else {
            toast.error("File type not supported");
        }
    };



    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removevideo = () => {
        setVideoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };


    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                            type="button"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}

            {videopreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <video
                            src={videopreview}
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                            controls
                        />
                        <button
                            onClick={removevideo}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                            type="button"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}


            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">

                    <div className="relative inline-block">

                        <button className="mt-1 btn btn-circle" type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><Smile size={20} /></button>

                        <div className={`absolute bottom-full w-20 mb-2 z-50 ${showEmojiPicker ? 'block' : 'hidden'}`}>
                            <emoji-picker id="emojiPicker" ref={emojiPickerRef}></emoji-picker>
                        </div>

                    </div>

                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleMediaChange}
                    />

                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn  btn-circle  "
                    disabled={!text.trim() && !imagePreview && !videopreview}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}