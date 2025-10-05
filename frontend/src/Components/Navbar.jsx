"use client"
import { logoutThunk } from "../store/thunks";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Navbar() {

    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const { authUser } = authState;

    const logoutfun = async () => {

        const result = await dispatch(logoutThunk());
        
         if (logoutThunk.fulfilled.match(result)) {
                    toast('Logout successful!y');
                    router.push('/login');
                } else {
                    toast(result.payload || 'Logout failed');
                }
    }

    return (
        <header
            className="py-1 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg "
        >
            <div className="container mx-auto px-4 h-10">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">Chatty</h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={"/settings"}
                            className={`
              btn btn-sm gap-2 transition-colors
              
              `}
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Link>

                        {authUser && (
                            <>
                                <Link href="/profile" className={`btn btn-sm gap-2`}>
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">{authUser?.fullname}</span>
                                </Link>

                                <button className="btn btn-sm gap-2" onClick={logoutfun} >
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );

}