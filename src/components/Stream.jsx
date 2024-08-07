import React, { useEffect, useRef } from 'react'

const Stream = ({stream}) => {
    const streamRef= useRef()

    useEffect(()=>{
        if(streamRef.current) streamRef.current.srcObject = stream
    },[stream])
  return (
    <video ref={streamRef} autoPlay  className='w-fit border-2'></video>
  )
}

export default Stream