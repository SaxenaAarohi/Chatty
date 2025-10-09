"use client"
import { logoutThunk } from "../store/thunks";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Navbar() {

    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const { authUser } = authState;

    const logoutfun = async () => {

        const result = await dispatch(logoutThunk());
         toast.success('Logout successful!y');
                    router.push('/login');
        //  if (logoutThunk.fulfilled.match(result)) {
                   
        //         } else {
        //             toast(result.payload || 'Logout failed');
        //         }
    }

    return (
        <header
            className="py-1 text-primary border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg "
        >
            <div className="container mx-auto px-4 h-10">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg  flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 " />
                            </div>
                            <h1 className="text-lg  font-bold">Chatty</h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={"/settings"}
                            className={`
              btn btn-sm gap-2 transition-colors  text-primary
              rounded-sm
              `}
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline ">Settings</span>
                        </Link>

                        {authUser && (
                            <>
                                <Link href="/profile" className={`btn  rounded -sm text-primary btn-sm gap-2`}>
                                    <User className="size-5" />
                                    <span className="hidden  sm:inline">{authUser?.fullname}</span>
                                </Link>

                                <button className="btn  text-primary rounded-sm  btn-sm gap-2" onClick={logoutfun} >
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