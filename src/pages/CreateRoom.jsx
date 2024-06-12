import React, { useState } from 'react';
import '../App.css';

const CreateRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 10);
    setRoomId(id);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className='bg-cover bg-center min-h-screen flex flex-col justify-center items-center overflow-hidden' style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/021/736/713/large_2x/doodle-lines-arrows-circles-and-curves-hand-drawn-design-elements-isolated-on-white-background-for-infographic-illustration-vector.jpg')" }}>
      <h1 className='glow mb-10 md:text-[6rem] xs:text-[4rem]'>Create Room</h1>
      <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg flex flex-col justify-center items-center w-4/5 max-w-md border border-black'>
        <div className='mb-4 w-full'>
          {roomId && (
            <div className='mt-4 flex items-center'>
              <input 
                type="text" 
                value={roomId} 
                readOnly 
                className='border border-gray-300 p-2 rounded-l w-full'
              />
              <button 
                onClick={copyToClipboard} 
                className={`bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-r ${isCopied ? 'bg-green-500' : ''}`}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
          <button onClick={generateRoomId} className='bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 mt-1 rounded w-full'>Generate Room ID</button>
        </div>
        <div className='mb-4 w-full'>
          <label className='block mb-2'>Number of Rounds</label>
          <input className='border border-gray-300 p-2 w-full rounded' type="number" placeholder="Enter number of rounds" />
        </div>
        <div className='mb-4 w-full'>
          <label className='block mb-2'>Words per Round</label>
          <input className='border border-gray-300 p-2 w-full rounded' type="number" placeholder="Enter words per round" />
        </div>
        <div className='mb-4 w-full'>
          <label className='block mb-2'>Timer (seconds)</label>
          <input className='border border-gray-300 p-2 w-full rounded' type="number" placeholder="Enter timer in seconds" />
        </div>
        <button className='bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded w-full'>Create Room</button>
      </div>
    </div>
  );
}

export default CreateRoom;
