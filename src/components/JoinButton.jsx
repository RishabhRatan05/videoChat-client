import React, { useContext } from 'react'

import { RoomContext } from '../context/RoomContext'

const JoinButton = () => {
    const {ws} = useContext(RoomContext)

    const handleClick=()=>{
        ws.emit('create-room')
    }
  return (
    <button onClick={handleClick} className='
    bg-green-400 text-white rounded-lg cursor-pointer hover:bg-green-500 ease-in duration-75 p-2'>Start New Meet</button>
  )
}

export default JoinButton