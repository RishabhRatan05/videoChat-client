import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { v4 as uuid } from "uuid";

const Home = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const [room,setRoom] =useState()
    const [email,setEmail] = useState()
    const handleJoinRoom= useCallback((e)=>{
      e.preventDefault()
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
    <form onSubmit={handleJoinRoom} className='flex justify-center items-center w-full h-screen flex-col gap-4 bg-gradient-to-tr from-teal-300 to bg-pink-800'>
        <div className='inline-block'>

        <div className='md:text-8xl sm:text-6xl text-5xl animation-pl text-white'>Get Started...</div>
        </div>
        <div className='inline-block'>
          <div className="flex flex-col gap-2 justify-center items-center">

        <input type='text' value={email} 
            onChange={e=>setEmail(e.target.value)}
            className='
            sm:text-2xl text-xl md:text-3xl 
            text-white 
            focus:outline-none
            focus:border-green-300 rounded-sm 
            placeholder:text-slate-200
            px-2 
            border-sky-300 border-2 bg-transparent' placeholder='email'></input>
          <input type='text' value={room} 
            required={true}
            onChange={e=>setRoom(e.target.value)}
            className='
            sm:text-2xl text-xl md:text-3xl 
            text-white 
            focus:outline-none
            focus:border-green-300 rounded-sm 
            placeholder:text-slate-200
            px-2 
            border-sky-300 border-2 bg-transparent' placeholder='room'></input>
          </div>
        </div>
    <button className='
    bg-green-400 text-white rounded-lg cursor-pointer hover:bg-green-500 ease-in duration-75 p-2'>Start New Meet</button>

    </form>
  )
}

export default Home