import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoomForm = ({uuid,socket,setUser}) =>
{
    const [roomId,setRoomId] = useState(uuid());
    const [name,setName] = useState("");

    const navigate = useNavigate();

    const handleCreateRoom = (e) => {
        e.preventDefault();
         const roomData = {
            name,
            roomId,
            userId: uuid(),
            host:true,
            presenter:true,
         };
         setUser(roomData);
         navigate(`/${roomId}`);
         console.log(roomData);
         socket.emit("userJoined",roomData);
    };

    return(
        <form className="form col-md-12 mt-5">
            <div className="form-group">
                <input type="text" className="form-control my-2" 
                placeholder="Enter your name"
                value={name}
                onChange={(e)=>setName(e.target.value)}>
                </input>
            </div>
            <div className="form-group">
                <div className="input-group d-flex">
                    <input type="text"  className="form-control my-2"
                    disabled
                    value={roomId}
                    placeholder="Generate room code">
                    </input>
                </div>
                <div className="input-group-append d-flex gap-1">
                    <button className="btn btn-primary btn-sm me-1" onClick={ ()=> setRoomId(uuid())}>
                        Generate
                    </button>
                    <button className="btn btn-outline-danger btn-sm">
                        Copy
                    </button>
                </div>
            </div>
            <button type="submit" onClick={handleCreateRoom} className="mt-3 btn btn-primary btn-block form-control">Generate Room</button>
        </form>
    );
};

export default CreateRoomForm;