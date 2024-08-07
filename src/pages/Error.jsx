import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
    const navigate = useNavigate()
  return (
    <div className='flex flex-col justify-center items-center gap-2 text-white bg-gradient-to-tr from-yellow-400 to-pink-500 h-screen '>
        <div>
            Something went wrong 
            </div>
            <div onClick={()=>navigate('/')}>Home</div></div>
  )
}

export default Error