import React from 'react'
import JoinButton from '../components/JoinButton'

const Home = () => {
  return (
    <div className='flex justify-center items-center w-full h-screen flex-col gap-4 bg-gradient-to-tr from-teal-300 to bg-pink-800'>
        <div className='inline-block'>

        <div className='md:text-8xl sm:text-6xl text-5xl animation-pl text-white'>Get Started...</div>
        </div>
        <div className='inline-block'>
        {/* <input type='text' className='
            sm:text-2xl text-xl md:text-3xl 
            text-white 
            focus:outline-none
            focus:border-green-300 rounded-sm 
            placeholder:text-slate-200
            px-2 
            border-sky-300 border-2 bg-transparent' placeholder='Name'></input> */}
        </div>
        <JoinButton/>
    </div>
  )
}

export default Home