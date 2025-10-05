"use client"
import { getMessages } from "@/store/thunks";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeleton/MessageInput";
import { formatMessageTime } from "@/lib/utils";
import { getSocket } from "@/lib/socket";

export default function ChatContainer() {

    const { messages, selectedUser, isMessageLoading } = useSelector((state) => state.chat);
    const { authUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);


useEffect(() => {
    const socket = getSocket(); 
    if (socket) {
        socket.on("receive-message", ({ message }) => {
            console.log("📩 New message received:", message);
            dispatch({ type: "chat/addMessage", payload:  message  });
        }); 
    }
    return () => {
        if (socket) {
            socket.off("receive-message");
        }                   

    };
}, []);

    useEffect(() => {
        dispatch(getMessages());
    }, [selectedUser,getMessages]);


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">

            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ?
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat ${message.senderId == authUser?.id ? "chat-end" : "chat-start"}`}

                        >
                            <div className=" chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img
                                        src={
                                            message.senderId === authUser.id
                                                ? authUser.profilepic || "/avatar.png"
                                                : selectedUser.profilepic || "/avatar.png"
                                        }
                                        alt="profile pic"
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageTime(message.createdAt)}
                                </time>
                            </div>
                            <div className="chat-bubble flex flex-col max-w-xs break-words">
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    ))
                    :
                    <div className="text-center pt-36">
                        No chat found
                    </div>
                }
                <div ref={messagesEndRef} />
            </div>

            <MessageInput />

        </div>
    )
}