"use client"
import { useEffect, useState } from "react";
import { THEMES } from "../constants/themes";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/Themecontext";

export default function Setting() {

  const { theme, changeTheme } = useTheme();
  const [Theme, setTheme] = useState(theme);

  const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey! How's it going?", isSent: false },
    { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
  ];
  return (
    <div className=" h-auto container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Theme</h2>
            <button className="btn btn-sm bg-primary text-primary-content ml-[40%]" onClick={() => changeTheme(Theme)}>Save Theme</button>
          </div>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        <div className="flex  gap-10 w-full">
          <div className="grid grid-cols-4 w-[50%] sm:grid-cols-6 md:grid-cols-4 gap-2">
            {THEMES.map((t, index) => (
              <button
                key={index}
                className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
               ${t === Theme ? "ring-2 ring-primary" : ""}
              `}
                onClick={() => setTheme(t)}
              >
                <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>

          <div className="w-[50%] ">
            <div data-theme={Theme} className=" rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">

              <div className="p-4 bg-base-200">
                <div className="max-w-lg mx-auto">

                  <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">

                    <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center  font-medium">
                          J
                        </div>
                        <div>
                          <h3 className="font-medium  text-sm">John Doe</h3>
                          <p className="text-xs ">Online</p>
                        </div>
                      </div>
                    </div>


                    <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                      {PREVIEW_MESSAGES.map((message) => (
                        <div
                          key={message.id}
                          className={`flex  ${message.isSent ? "justify-end " : "justify-start"}`}
                        >
                          <div
                            className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm 
                        bg-primary text-primary-content
                        `}
                          >
                            <p className="text-sm ">{message.content}</p>
                            <p
                              className={`
                            text-[10px] mt-1.5
                          `}
                            >
                              12:00 PM
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>


                    <div className="p-4 border-t border-base-300 bg-base-100">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1 text-sm h-10"
                          placeholder="Type a message..."
                          value="This is a preview"
                          readOnly
                        />
                        <button className="btn btn-primary h-10 min-h-0">
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}