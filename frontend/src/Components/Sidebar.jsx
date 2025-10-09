"use client"
import { setSelectedUser } from "../store/chatSlice";
import { Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "./Skeleton/SidebarSkeleton";
import { useState } from "react";

export default function Sidebar() {

  const { users, selectedUser, isUserLoading } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const handleUserClick = (user) => {
    dispatch(setSelectedUser(user));
  };

    const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user.id))
    : users;

  if (isUserLoading) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20  lg:w-58 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
               checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers?.map((user) => (
          <button
            key={user.id}
            onClick={() => handleUserClick(user)}
            className={`
              w-full p-3 flex items-center gap-3 
              hover:bg-primary/50 transition-colors
            ${selectedUser?.id === user.id ? "bg-primary/40 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user?.profilepic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user.id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}

            </div>

            <div className="hidden  lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-base">
                {onlineUsers?.includes(user?.id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers?.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
}