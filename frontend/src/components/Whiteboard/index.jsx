import { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

const WhiteBoard = ({ canvasRef, 
    ctxRef, 
    elements, 
    setElements, 
    tool, 
    color, 
    brushSize, 
    user,
    socket }) => {

    const [img,setImg] = useState(null);
    useEffect(() => {
        socket.on("whiteBoardDataResponse", (data) => {
          setImg(data.imgURL);
        });
      }, []);

    if (!user?.presenter) {
        return (
            <>
            <div className="border border-dark border-3 overflow-hidden" style={{ width: '100%', height: '800px' }}>
                <img src={img}
                style={{ width: window.innerWidth * 2, height: '800px' }}
                alt="Real time white board image shared by presenter"/>
            </div>
            </>
        ); 
    }

    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = 800;
        canvas.width = window.innerWidth * 2;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";

        ctxRef.current = ctx;

    }, [color, brushSize]);

    useEffect(() => {
        ctxRef.current.strokeStyle = color;
    }, [color]);

    useEffect(() => {
        ctxRef.current.lineWidth = brushSize;
    }, [brushSize]);

    useLayoutEffect(() => {
        if (canvasRef) {
            const roughCanvas = rough.canvas(canvasRef.current);

            if (elements.length > 0) {
                ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            elements.forEach((element) => {
                if (element.type === "pencil") {
                    roughCanvas.linearPath(element.path, {
                        stroke: element.stroke,
                        strokeWidth: element.strokeWidth,
                        roughness: 0,
                    });
                }
                else if (element.type === "line") {
                    roughCanvas.draw(
                        roughGenerator.line(
                            element.offsetX,
                            element.offsetY,
                            element.width,
                            element.heigth,
                            {
                                stroke: element.stroke,
                                strokeWidth: element.strokeWidth,
                                roughness: 0,
                            })
                    );
                }
                else if (element.type === "rect") {
                    roughCanvas.draw(
                        roughGenerator.rectangle(
                            element.offsetX,
                            element.offsetY,
                            element.width,
                            element.heigth,
                            {
                                stroke: element.stroke,
                                strokeWidth: element.strokeWidth,
                                roughness: 0,
                            })
                    );
                }
            });
            const canvasImage = canvasRef.current.toDataURL();
            socket.emit("whiteboardData",canvasImage);
        }
    }, [elements]);

    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        //console.log(offsetX, offsetY);

        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "pencil",
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color,
                    strokeWidth: brushSize,
                },
            ]);
        }
        else if (tool === "line") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "line",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    heigth: offsetY,
                    stroke: color,
                    strokeWidth: brushSize,
                },
            ]);
        }
        else if (tool === "rect") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "rect",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    heigth: offsetY,
                    stroke: color,
                    strokeWidth: brushSize,
                },
            ]);
        }
        setIsDrawing(true);
    }

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (isDrawing) {

            if (tool === "pencil") {
                const { path } = elements[elements.length - 1];
                const newPath = [...path, [offsetX, offsetY]];
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                path: newPath,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            }
            else if (tool === "line") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX,
                                heigth: offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            }
            else if (tool === "rect") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX - ele.offsetX,
                                heigth: offsetY - ele.offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            }
        }
    };

    const handleMouseUp = (e) => {
        setIsDrawing(false);
    }


    return (
        <>
            {/* {JSON.stringify(elements)} */}
            <div onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="border border-dark border-3 h-100 w-100 overflow-hidden">
                <canvas ref={canvasRef} />
            </div>
        </>
    );
};
export default WhiteBoard;