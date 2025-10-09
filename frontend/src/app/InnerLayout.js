"use client";
import { connectSocket, disconnectSocket } from "../lib/socket";
import { checkAuth, fetchUsers } from "../store/thunks";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { useTheme } from "../lib/Themecontext";

export default function InnerLayout({ children }) {

    const { theme } = useTheme();

    const darktheme = ['Synthwave', 'Cyberpunk', 'Black', 'Hallowean', 'Forest', 'Luxury', 'Business', 'Night', 'Coffee', 'Dim', 'Sunser'];
    const authUser = useSelector((state) => state.auth.authUser);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [checkAuth]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [fetchUsers]);

    useEffect(() => {
        if (authUser && authUser.id) {
            connectSocket(authUser.id, dispatch);
        }

        return () => {
            disconnectSocket();
        };
    }, [authUser?.id]);


    return (

        <div data-theme={theme}>

            <Navbar />

            {children}

            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: 'var(--p)',   
                      color: 'var(--pf) !important',
                    },
                }}
            />




        </div>

    );
}
