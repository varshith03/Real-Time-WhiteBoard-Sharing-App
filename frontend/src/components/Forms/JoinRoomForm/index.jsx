import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomForm = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleRoomJoin = (e) => {
    e.preventDefault();
    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: false,
    };
    setUser(roomData);
    navigate(`/${roomId}`);
    console.log(roomData);
    socket.emit("userJoined", roomData);
  };

  return (
    <form className="form col-md-12 ">
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        ></input>
      </div>
      <div className="form-group">
        <div className="input-group d-flex">
          <input
            type="text"
            className="form-control my-2"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room code"
          ></input>
        </div>
      </div>
      <button
        type="submit"
        onClick={handleRoomJoin}
        className="mt-3 btn btn-block form-control"
        style={{ backgroundColor: "#27cdd3", borderColor: "#27cdd3" }}
      >
        Join Room
      </button>
    </form>
  );
};

export default JoinRoomForm;
