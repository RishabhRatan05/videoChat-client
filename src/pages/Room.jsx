import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Stream from '../components/Stream'
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons'
  import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const {roomId} = useParams()
    const navigate = useNavigate()
    const [calling,setCalling] = useState(true)

  const handleUserJoined = useCallback(({  id }) => {
    console.log(`Email  joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
      setCalling(false)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

    const handleCopy=()=>{
      navigator.clipboard.writeText(roomId)
      toast('Copied to clipboard')
    }
    const handleCallEnd=()=>{
      setMyStream(null)
      socket.emit('disconnect-user')
      navigate("/")
    }

    const handleJoinRoom= useCallback(()=>{
      const room = uuid()
      const email = 'New'
      socket.emit('room:join',{email,room})
      navigate(`/room/${room}`);
    },[socket])

    useEffect(()=>{
      if(typeof(roomId) == 'undefined'){
      socket.on("room:join", handleJoinRoom);
      return () => {
        socket.off("room:join", handleJoinRoom);
      };
      }
    },[roomId])

    useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);
  return (
    <div className='bg-gradient-to-tr from-[#179BAE] to bg-purple-500 h-screen'>
      <ToastContainer/>
      <div className='mx-4'>
        <div className='text-purple-400'>

        Room id <span className='text-white'> {roomId}</span> <FontAwesomeIcon className='cursor-pointer' onClick={handleCopy} icon={faCopy} />
        </div>
      <h4>{remoteSocketId ? <span className='text-green-300'>Connected</span> : <span className='text-purple-300'>No one in the room</span>}</h4>
        </div>
      <div className='flex flex-col sm:grid grid-cols-2 p-2 gap-2'>
      {myStream && 
          <div className='flex flex-col items-center justify-center'>
        <h1 className='bg-orange-400 text-white px-2 rounded-md w-fit'>You</h1>
        <Stream stream={myStream}/>
          </div>
        }
      {remoteStream &&
        <div className='flex flex-col items-center justify-center'>
      <h1 className='bg-sky-400 text-white px-2 rounded-md w-fit'>Remote</h1>


       <Stream stream={remoteStream}/>
        </div>
      }
      </div>
      <div className='flex  justify-center gap-4'>

      {myStream && <button onClick={sendStreams} className='text-white flex justify-center items-center gap-2'>Send <FontAwesomeIcon icon={faVideo} /></button>}
      {calling && remoteSocketId  && <button onClick={handleCallUser} className='bg-green-400 px-2 rounded-md text-white'>
        <FontAwesomeIcon icon={faPhone}/></button>
  
        } 
      {!calling &&
      <button onClick={handleCallEnd} className='bg-red-400 px-2 rounded-md text-white'>
        <FontAwesomeIcon icon={faPhone}/></button>
      }
      </div>
    </div>
  )
}

export default Room