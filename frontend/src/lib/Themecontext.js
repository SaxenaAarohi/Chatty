"use client"
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ThemeContext = createContext();

 const ThemeProvider = ({ children }) => {

    const router = useRouter();
  const [theme, setTheme] = useState("dark");    
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  },[]);

  function changeTheme(newTheme)  {
        router.push("/");
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
        toast ("Theme changed");
    document.documentElement.setAttribute("data-theme", newTheme);
  }

  return ( 
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
   )

};

export const useTheme = () =>  useContext(ThemeContext);

export default ThemeProvider;