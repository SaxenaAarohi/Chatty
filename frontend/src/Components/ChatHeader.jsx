import { setSelectedUser } from "@/store/chatSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ChatHeader() {

    const {onlineUsers} = useSelector((state) => state.auth);

    const { selectedUser } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    function handleclose() {
        dispatch(setSelectedUser(null));
    }

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilepic || "/avatar.png"} alt={selectedUser.fullname} />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium">{selectedUser.fullname}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser.id) ? "Online" : "Offline"}
                        </p>
                      
                    </div>
                </div>


                <button onClick={handleclose}>
                    x
                </button>
            </div>
        </div>
    );
}