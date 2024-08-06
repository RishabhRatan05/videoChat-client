import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import socketIO from "socket.io-client"
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from "uuid";
import Peer from '../service/peer';
import { peerReducer } from "./peerReducer";
import { addPeerAction } from "./peerActions";
const URL = "http://localhost:5000"

const ws= socketIO(process.env.REACT_APP_SERVER_URL)
export const RoomContext = createContext()

const RoomProvider = ({children})=>{
    const navigate = useNavigate()
    const [me,setMe] = useState()
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [peers, dispatch] = useReducer(peerReducer,{})

    const enterRoom=({roomId, from})=>{
        console.log('user id',from)
        setRemoteSocketId(from)
        navigate(`/room/${roomId}`)
    }
    const handleUserJoined= useCallback(({peerId})=>{
        setRemoteSocketId(peerId);
    },[])

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
        });
        const offer = await Peer.getOffer();
        ws.emit("user-call", { to: remoteSocketId, offer });
        setMyStream(stream);
    }, [remoteSocketId, ws]);

    const handleIncomingCall = useCallback( async ({from,offer})=>{
        try {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            console.log(`Incoming Call`, from, offer);
            const ans = await Peer.getAnswer(offer);
            ws.emit("call-accepted", { to: from, ans });
        } catch (error) {
            console.error(error.message)
        }
    },[ws])

    const sendStreams = useCallback(() => {
        if(myStream){for (const track of myStream.getTracks()) {
        Peer.peer.addTrack(track, myStream);
        }}

    }, [myStream]);

    const handleCallAccepted = useCallback(
        ({ from, ans }) => {
        Peer.setLocalDescription(ans);
        console.log("Call Accepted!");
        sendStreams();
        },
        [sendStreams]
    );   

    const handleNegoNeeded = useCallback(async () => {
        const offer = await Peer.getOffer();
        ws.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, ws]);

  useEffect(() => {
    Peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      Peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await Peer.getAnswer(offer);
      ws.emit("peer:nego:done", { to: from, ans });
    },
    [ws]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await Peer.setLocalDescription(ans);
  }, []); 



    useEffect(() => {
        Peer.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        console.log("GOT TRACKS!!");
        console.log('remote',remoteStream)
        setRemoteStream(remoteStream[0]);
        });
    }, [
    ws,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

    useEffect(()=>{

        ws.on('user-joined',handleUserJoined)
        ws.on('incoming-call',handleIncomingCall)
        ws.on('room-created',enterRoom)
        // ws.on('get-users',getUsers)
        ws.on('call-accepted',handleCallAccepted)
        ws.on("peer:nego:needed", handleNegoNeedIncomming);
        ws.on("peer:nego:final", handleNegoNeedFinal);
            return()=>{
            ws.off('user-joined',handleUserJoined)
            ws.off('incoming-call',handleIncomingCall)
            ws.off('room-created',enterRoom)
            // ws.off('get-users',getUsers)       
            ws.off('call-accepted',handleCallAccepted)
            ws.off("peer:nego:needed", handleNegoNeedIncomming);
            ws.off("peer:nego:final", handleNegoNeedFinal);

        }
    },[])
    return(
        <RoomContext.Provider value={{ws, me, myStream, remoteStream,remoteSocketId, sendStreams,setMyStream, peers, handleCallUser}}>
            {children}
        </RoomContext.Provider>
    )
}

export default RoomProvider