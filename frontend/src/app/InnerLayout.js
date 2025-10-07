"use client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import Navbar from "../Components/Navbar";
import { useTheme } from "../lib/Themecontext";
import store from "../store/store";

export default function InnerLayout({ children }) {
    const { theme } = useTheme(); 

    return (

        <div data-theme={theme}>

            <Provider store={store}>

                <Navbar />

                {children}

                <ToastContainer position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={theme}

                />

            </Provider>

        </div>

    );
}
