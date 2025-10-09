"use client"
import { getSocket } from "../lib/socket";
import formatChatDate, { formatMessageTime } from "../lib/utils";
import { getMessages } from "../store/thunks";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeleton/MessageInput";

export default function ChatContainer() {

    const { messages, selectedUser, isMessageLoading } = useSelector((state) => state.chat);
    const { authUser } = useSelector((state) => state.auth);

    const dispatch = useDispatch();


    const [activeImage, setActiveImage] = useState(null);

    const messagesEndRef = useRef(null);


    useEffect(() => {
        const socket = getSocket();
        if (socket) {
            socket.on("receive-message", ({ message }) => {
                dispatch({ type: "chat/addMessage", payload: message });
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
    }, [selectedUser, getMessages]);


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
                {messages.length > 0 ? (
                    messages.map((message, index) => {
                        const currentDate = new Date(message.createdAt).toDateString();
                        const previousDate =
                            index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
                        const showDateHeader = currentDate !== previousDate;

                        return (
                            <>
                                {showDateHeader && (
                                    <div className="text-center my-4">
                                        <span className="px-3 py-1  text-sm rounded-full text-primary">
                                            {formatChatDate(message.createdAt)}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={`chat ${message.senderId == authUser?.id ? "chat-end" : "chat-start"}`}
                                >
                                    <div className="chat-image avatar">
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

                                    <div className="chat-bubble bg-primary text-primary-content flex flex-col max-w-xs break-words">
                                        {message?.image && (
                                            <>
                                                <img
                                                    src={message.image}
                                                    alt="Attachment"
                                                    className="sm:max-w-[200px] rounded-md mb-2"
                                                   onClick={() => setActiveImage(message.image)}
                                                />
                                              
                                                {activeImage === message.image && (
                                                    <div
                                                        className="fixed inset-0 backdrop-blur-md backdrop-brightness-50 flex justify-center items-center z-50"
                                                        onClick={() => setActiveImage(null)} 
                                                    >
                                                        <img
                                                            src={message.image}
                                                            alt="Full Size"
                                                            className="max-w-[90%] max-h-[90%] rounded-md"
                                                            onClick={(e) => e.stopPropagation()} 
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {message?.video && (
                                            <video
                                                src={message.video}
                                                className="sm:max-w-[200px] rounded-md mb-2"
                                                controls
                                            />
                                        )}
                                        {message.text && <p>{message.text}</p>}
                                    </div>
                                </div>
                            </>
                        );
                    })
                ) : (
                    <div className="text-center pt-36">No chat found</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput />
        </div>
    );
}