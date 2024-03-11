import Chat from "../../components/ChatBar";
import WhiteBoard from "../../components/Whiteboard";
import RoomLoading from "../../components/miscellaneous/RoomLoading";
import "./index.css";
import { useEffect, useRef, useState } from "react";

const RoomPage = ({ user, socket, users }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [brush, setBrush] = useState(2);
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openedUserTab, setOpenedUserTab] = useState(false);
  const [openedChatTab, setOpenedChatTab] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const [loading, setLoading] = useState(true); // State to control the loading component

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Hide loading component after 5 seconds
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillRect = "white";
    setElements([]);
  };

  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    );
  };

  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

  return (
    <>
      {loading ? (
        <RoomLoading />
      ) : (
        <div className="row">
          <div className="col-md-12 mx-auto gap-3 mb-5 d-flex justify-content-between ">
            <button
              type="button"
              onClick={() => setOpenedUserTab(true)}
              className="btn btn-dark mx-2 my-5"
            >
              Users
            </button>
            <h1 className="text-center py-5">
              WhiteBoard Sharing App{" "}
              <span className="text-primary">
                [Users Online: {users.length}]
              </span>
            </h1>
            <button
              type="button"
              onClick={() => setOpenedChatTab(true)}
              className="btn btn-primary mx-2 my-5"
            >
              Chat
            </button>
            {openedUserTab && (
              <div
                className="position-fixed top=0 left-0 h-100 text-white bg-dark"
                style={{ width: "250px", left: "0%" }}
              >
                <div className="mx-2">
                  <button
                    type="button"
                    onClick={() => setOpenedUserTab(false)}
                    className="btn btn-light btn-block w-100 mt-5"
                  >
                    Close
                  </button>
                </div>
                <div className="w-100 mt-5 pt-5">
                  {users.map((usr, index) => (
                    <p key={index} className="my-2 text-center w-100">
                      {usr.name} {user && user.userId === usr.userId && "(You)"}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {openedChatTab && (
              <Chat
                setOpenedChatTab={setOpenedChatTab}
                socket={socket}
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
              ></Chat>
            )}
          </div>

          {/* here is all tools of drawing  */}
          {user?.presenter && (
            <div className="col-md-10 mx-auto gap-3 px-md-5 mb-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
              {/* radio buttons */}
              <div className="d-flex col-md-2 justify-content-between gap-1 mb-3">
                <div className="d-flex gap-1 align-items-center">
                  <label htmlFor="pencil">Pencil</label>
                  <input
                    type="radio"
                    name="tool"
                    id="pencil"
                    checked={tool === "pencil"}
                    value="pencil"
                    className="mt-1"
                    onChange={(e) => setTool(e.target.value)}
                  ></input>
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <label htmlFor="line">Line</label>
                  <input
                    type="radio"
                    name="tool"
                    id="line"
                    checked={tool === "line"}
                    value="line"
                    className="mt-1"
                    onChange={(e) => setTool(e.target.value)}
                  ></input>
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <label htmlFor="rect">Rectangle</label>
                  <input
                    type="radio"
                    name="tool"
                    id="rect"
                    checked={tool === "rect"}
                    value="rect"
                    className="mt-1"
                    onChange={(e) => setTool(e.target.value)}
                  ></input>
                </div>
              </div>
              {/* select color */}
              <div className="col-md-2 mb-3">
                <div className="d-flex align-items-center">
                  <label htmlFor="color">Select Color:</label>
                  <input
                    type="color"
                    id="color"
                    className="mt-1 mx-2"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  ></input>
                </div>
              </div>
              {/* brush size */}
              <div className="col-md-2 mb-3">
                <div className="d-flex">
                  <label htmlFor="brush">Select size:</label>
                  <input
                    type="range"
                    id="brush"
                    className="mt-1 ms-2"
                    min="1"
                    max="20"
                    value={brush}
                    onChange={(e) => setBrush(e.target.value)}
                  />
                </div>
              </div>
              {/* undo and redo button and clear button*/}
              <div className="col-md-3 d-flex gap-2 mb-3">
                <button
                  className="btn btn-primary mt-1"
                  disabled={elements.length === 0}
                  onClick={() => undo()}
                >
                  Undo
                </button>
                <button
                  className="btn btn-outline-primary mt-1"
                  disabled={history.length < 1}
                  onClick={() => redo()}
                >
                  Redo
                </button>
                <button
                  className="btn btn-danger mt-1"
                  onClick={handleClearCanvas}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="col-md-10 mx-auto mt-4 canvas-box">
            <WhiteBoard
              canvasRef={canvasRef}
              ctxRef={ctxRef}
              elements={elements}
              setElements={setElements}
              tool={tool}
              brushSize={brush}
              color={color}
              user={user}
              socket={socket}
            ></WhiteBoard>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomPage;
