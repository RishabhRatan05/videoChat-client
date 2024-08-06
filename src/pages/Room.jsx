import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RoomContext } from '../context/RoomContext'
import Stream from '../components/Stream'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faPhone, faVideo } from '@fortawesome/free-solid-svg-icons'
  import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
const Room = () => {
    const {roomId} = useParams()
    const navigate = useNavigate()
    const [calling,setCalling] = useState(true)
    const {ws,  myStream, remoteStream, sendStreams, setMyStream,remoteSocketId, handleCallUser} = useContext(RoomContext)

    useEffect(()=>{
        ws.emit('join-room',{roomId})
    },[roomId,ws])

    const handleCopy=()=>{
      navigator.clipboard.writeText(`${process.env.REACT_APP_URL}room/${roomId}`)
      toast('Copied to clipboard')
    }
    const handleSend=()=>{
      sendStreams()
      handleCallUser()
    }
    const handleCall=()=>{
      handleCallUser()
      setCalling(false)
    }
    const handleCallEnd=()=>{
      setMyStream(null)
      ws.emit('disconnect-user')
      navigate("/")
    }
    console.log('my',myStream,'re',remoteStream)
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

      {myStream && <button onClick={handleSend} className='text-white flex justify-center items-center gap-2'>Send <FontAwesomeIcon icon={faVideo} /></button>}
      {calling && remoteSocketId  && <button onClick={handleCall} className='bg-green-400 px-2 rounded-md text-white'>
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