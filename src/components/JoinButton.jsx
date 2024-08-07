import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { v4 as uuid } from "uuid";

const JoinButton = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const room = uuid()
    const [email,setEmail] = useState()
    const handleJoinRoom= useCallback(()=>{
        socket.emit('room:join',{email,room})
        navigate(`/room/${room}`);
    },[room,email,socket])

    useEffect(() => {
      socket.on("room:join", handleJoinRoom);
      return () => {
        socket.off("room:join", handleJoinRoom);
      };
    }, [socket, handleJoinRoom]);
  return (
    <button onClick={handleJoinRoom} className='
    bg-green-400 text-white rounded-lg cursor-pointer hover:bg-green-500 ease-in duration-75 p-2'>Start New Meet</button>
  )
}

export default JoinButton