import { useEffect, useState } from "react";
import "./index.css";
import { IoSend } from "react-icons/io5";

const Chat = ({ setOpenedChatTab, socket, chatMessages, setChatMessages }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    socket.on("messageResponse", (data) => {
      // setChat((prevChats) => [...prevChats, data]);
      setChatMessages((prevChats) => [...prevChats, data]);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      socket.emit("message", { message });
      // setChat((prevChats) => [...prevChats, { message, name: "You" }]);
      setChatMessages((prevChats) => [...prevChats, { message, name: "You" }]);
      setMessage("");
    }
    // setMessage([...chat,message]);
    // setMessage("");
  };

  return (
    <div
      className="position-fixed top-0 end-0 h-100 text-white bg-primary"
      style={{ width: "300px", right: "0%" }}
    >
      <div className="mx-2">
        <button
          type="button"
          onClick={() => setOpenedChatTab(false)}
          className="btn btn-light btn-block mx-auto w-100 mt-5"
        >
          Close
        </button>
      </div>
      <div
        className="w-100 mt-5 p-2 "
        style={{ height: "70%", overflowY: "auto" }}
      >
        {chatMessages.map((msg, index) => (
          <p key={index} className="my-2 text-center">
            {msg.name} : {msg.message}
          </p>
        ))}
      </div>
      <div className="mx-2">
        <form
          onSubmit={handleSubmit}
          className="w-100 mt-5 border d-flex rounded-3"
          style={{ height: "50px" }}
        >
          <input
            type="text"
            placeholder="Enter message"
            className="h-100 text-white form-control"
            style={{
              width: "90%",
              backgroundColor: "transparent",
              fontSize: "20px",
              border: "none",
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button
            type="submit"
            className="h-100 btn btn-light btn-light-hover"
            style={{ padding: 0, width: "15%", background: "white" }}
          >
            <IoSend
              style={{
                fontSize: "30px",
                color: "#0275d8",
              }}
            />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Chat;
