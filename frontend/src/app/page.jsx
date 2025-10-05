"use client"

import ChatContainer from "@/Components/ChatContainer";
import NoChatSelected from "@/Components/NoChatSelected";
import Sidebar from "@/Components/Sidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, fetchUsers } from "../store/thunks";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export default function Home() {

  const authUser = useSelector((state) => state.auth.authUser);
  const dispatch = useDispatch();
  
  useEffect(()=>{
    dispatch(checkAuth());
  },[checkAuth]);

  useEffect(() => {
    dispatch(fetchUsers());
  },[fetchUsers]);

  useEffect(() => {
    if (authUser && authUser.id) {
      connectSocket(authUser.id,dispatch);
    }

    return () => {
      disconnectSocket();
    };
  },[authUser?.id]);

    const selectedUser = useSelector((state) => state.chat.selectedUser);
  
   return (
          <div className="h-screen bg-base-200">
              <div className="flex items-center justify-center pt-20 px-4">
                  <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                      <div className="flex h-full rounded-lg overflow-hidden">
                          <Sidebar />
  
                          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                      </div>
                  </div>
              </div>
          </div>
      );
}
