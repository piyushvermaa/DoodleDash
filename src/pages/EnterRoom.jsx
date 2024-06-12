import React, { useState } from 'react';
import '../App.css';

const EnterRoom = () => {
  const [roomId, setRoomId] = useState('');

  const handleInputChange = (e) => {
    setRoomId(e.target.value);
  };

  const joinRoom = () => {
    console.log(`Joining room with ID: ${roomId}`);
  };

  return (
    <div className='bg-cover bg-center min-h-screen flex flex-col justify-center items-center overflow-hidden' style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/021/736/713/large_2x/doodle-lines-arrows-circles-and-curves-hand-drawn-design-elements-isolated-on-white-background-for-infographic-illustration-vector.jpg')" }}>
      <h1 className='glow mb-10 md:text-[6rem] xs:text-[4rem]'>Enter Room</h1>
      <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg flex flex-col justify-center items-center w-4/5 max-w-md border border-black'>
        <div className='mb-4 w-full'>
          <label className='block mb-2'>Room ID</label>
          <input 
            className='border border-gray-300 p-2 w-full rounded' 
            type="text" 
            placeholder="Enter Room ID" 
            value={roomId} 
            onChange={handleInputChange} 
          />
        </div>
        <button 
          onClick={joinRoom} 
          className='bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded w-full'>
          Join Room
        </button>
      </div>
    </div>
  );
}

export default EnterRoom;
