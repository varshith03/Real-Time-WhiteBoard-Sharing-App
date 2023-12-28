import './App.css'
import { Route, Routes, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import {ToastContainer} from "react-toastify";
import { toast } from 'react-toastify';

import Forms from './components/Forms'
import RoomPage from './pages/RoomPage';
import AuthForm from './components/AuthForm';

import { useEffect, useState } from 'react';

const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {

  const [user,setUser] = useState(null);
  const [users,setUsers] = useState([]);
  const navigate = useNavigate(); 

  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        console.log("userJoined");
        setUsers(data.users);
      }else{
          console.log("userJoined error");
        }
    });
    
    socket.on("allUsers",data=>{
      setUsers(data);
    });

    socket.on("userJoinedMessageBroadcasted",(data)=>{
      //console.log(`${data} joined the room`);
      toast.success(`${data} joined the room`);
    });

    socket.on("userLeftMessageBroadcasted",(data)=>{
      //console.log(`${data} left the room`);
      toast.info(`${data} left the room`);
    });

  },[]);

  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  const handleRegisterClick = () => {
    navigate('/auth-form');
  };

  return (
    <div className='container'>
      <ToastContainer></ToastContainer>
      <Routes>
        <Route path='/' 
        element={<Forms uuid={uuid} socket={socket} setUser={setUser}>
        </Forms>}>
        </Route>

        <Route
          path='/auth-form'
          element={<AuthForm />} // Render your AuthForm component here
        ></Route>

        <Route path="/:roomId" 
        element={<RoomPage user={user} socket={socket} users={users}>
        </RoomPage>}>

        </Route>
      </Routes>
      <div className='registration-container'>
        <div className='glowing-text'>
          Please register to start using the whiteboard
        </div>
        <a href='#' className='register-button' onClick={handleRegisterClick}>
          Register
        </a>
      </div>
    </div>
  )
}

export default App;
