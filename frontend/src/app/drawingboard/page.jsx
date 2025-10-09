"use client"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSocket } from "../../lib/socket";
import { ArrowLeft, Undo } from "lucide-react";

export default function Page() {

    const router = useRouter();
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const socket = getSocket();

    const [mouseDown, setMouseDown] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const [color, setColor] = useState("#000000");
    const [currentstroke, setCurrentStroke] = useState([]);
    const [stroke, setStroke] = useState([]);


    useEffect(() => {

        const canvas = canvasRef.current;

        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineWidth = 1;

        ctx.strokeStyle = color;
        ctxRef.current = ctx;

        socket.on("draw", ({ x, y }) => {
            ctx.lineTo(x, y);
            ctx.stroke();
        });

        socket.on("down", ({ x, y }) => {
            ctx.moveTo(x, y);
        });

        socket.on("undo", () => {
            setStroke((prevStrokes) => {
                const newStrokes = prevStrokes.slice(0, -1);
                redraw(newStrokes);
                return newStrokes;
            })
        });


            return () => {
                socket.off("draw");
                socket.off("down");
                socket.off("undo");
            };
        }, []);


        useEffect(() => {
            if (ctxRef.current) {
                ctxRef.current.strokeStyle = color;
            }
        }, [color]);


        const handleMouseDown = (e) => {
            const { offsetX, offsetY } = e.nativeEvent;
            ctxRef.current.moveTo(offsetX, offsetY);
            socket.emit("down", { x: offsetX, y: offsetY });
            setMouseDown(true);
            setCurrentStroke([{ x: offsetX, y: offsetY }]);
        };


        const handleMouseUp = () => {
            setMouseDown(false);
            if (currentstroke.length > 0) {
                setStroke((prev) => [...prev, currentstroke]);
                setCurrentStroke([]);
            }
        };


        const handleMouseMove = (e) => {
            if (!mouseDown) return;
            const { offsetX, offsetY } = e.nativeEvent;
            setX(offsetX);
            setY(offsetY);

            ctxRef.current.lineTo(offsetX, offsetY);
            ctxRef.current.stroke();
            socket.emit("draw", { x: offsetX, y: offsetY });

            setCurrentStroke((prev) => [...prev, { x: offsetX, y: offsetY }]);
        };

        const undo = () => {
            const newstroke = stroke.slice(0, -1);
            setStroke(newstroke);
            redraw(newstroke);

            socket.emt("undo");
        }


        const redraw = (stroketodraw) => {

            const canvas = canvasRef.current;
            const ctx = ctxRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stroketodraw.forEach((stroke) => {
                ctx.beginPath();
                stroke.forEach((point, index) => {
                    if (index === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
                ctx.stroke();
            });
        }

        return (

            <div className="h-screen bg-base-200">
                <div className="flex items-center justify-center pt-12 px-4">
                    <div className="rounded-lg  w-full max-w-6xl h-[calc(100vh-8rem)]">
                        <diV className="flex my-2 items-center justify-between  "    >

                            <button onClick={() => router.push('/')} className="bg-primary rounded-3xl text-sm  text-primary-content p-2 ">
                                <ArrowLeft />
                            </button>

                            <div className="flex items-center gap-2">
                                <label className="text-sm">Brush Color:</label>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => {
                                        setColor(e.target.value);
                                    }}
                                    classNam e="w-10 h-8 p-0 border border-gray-300 rounded"
                                />
                                <button onClick={undo} disabled={stroke.length === 0}>
                                    <Undo />
                                </button>
                            </div>
                        </diV>
                        <div className="flex bg-white h-full rounded-lg overflow-hidden">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            ></canvas>
                        </div>
                    </div>
                </div>
            </div>
        )

    }