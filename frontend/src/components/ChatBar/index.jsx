import { useEffect, useState } from 'react';
import './index.css';

const Chat = ({ setOpenedChatTab, socket }) => {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.on("messageResponse", (data) => {
            setChat((prevChats) => [...prevChats, data]);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() !== "") {
            socket.emit("message", { message });
            setChat((prevChats) => [...prevChats, { message, name: "You" }]);
            setMessage("");
        }
        // setMessage([...chat,message]);
        // setMessage("");
    }

    return (
        <div className="position-fixed top=0 left-0 h-100 text-white bg-dark"
            style={{ width: "400px", left: "0%" }}>
            <button type="button"
                onClick={() => setOpenedChatTab(false)}
                className="btn btn-light btn-block w-100 mt-5">
                Close
            </button>
            <div className="w-100 mt-5 p-2 border border-1 border-white rounded-3"
                style={{ height: "70%" }}>
                {
                    chat.map((msg, index) => (
                        <p key={index * 999} className="my-2 text-center w-100 py-2 border border-left-0 border-right-0">
                            {msg.name} : {msg.message}
                        </p>
                    ))
                }
                chatsss
            </div>
            <form onSubmit={handleSubmit} className="w-100 mt-5 border d-flex rounded-3" style={{ height: "50px" }}>
                <input type="text" placeholder="Enter message" className="h-100 text-white font-size:20px"
                    style={{ width: "90%", "backgroundColor": "transparent", fontSize: '20px' }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}>
                </input>
                <button type="submit" className="btn btn-light btn-light-hover">
                    Send
                </button>
            </form>
        </div>
    );
};
export default Chat;