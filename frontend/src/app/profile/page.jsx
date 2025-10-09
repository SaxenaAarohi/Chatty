"use client"
import imageCompression from "browser-image-compression";
import { Camera, Mail, User } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateprofileThunk } from "../../store/thunks";

export default function Page() {

    const dispatch = useDispatch();
    const [selectedImg, setSelectedImg] = useState(null);
    const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);
    const  [user,setUser] = useState(authUser);

    const handleImageUpload = async (e) => {
        e.preventDefault();
      
        const file = e.target.files[0];

        if (!file) {
            console.log("not found");
            return;
        };

        const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true
        });


        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);

        reader.onload = async () => {
            const profilepic = reader.result;
            setSelectedImg(profilepic);
            const dispatching = await dispatch(updateprofileThunk(profilepic));
            
        }

    }

    return (
        <div className="h-full  ">
            <div className="max-w-xl  mx-auto p-4 mt-4">
                <div className="bg-primary text-primary-content  rounded-xl mt-4 px-6 py-4 space-y-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold ">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>


                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={selectedImg || user?.profilepic }

                                className="size-32 rounded-full object-cover border-4 "
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                   ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                            >
                                <Camera className="w-5 h-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className="text-sm ">
                            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="  text-sm  flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </div>
                            <p className="px-4 py-2.5 rounded-lg border">{user?.fullname}</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm  flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                            <p className="px-4 py-2.5 rounded-lg border">{user?.email}</p>
                        </div>
                    </div>

                    <div className="mt-3 rounded-xl p-6">
                        <h2 className="text-lg font-medium  mb-4">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between pt-1">
                                <span>Account Status</span>
                                <span>Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}