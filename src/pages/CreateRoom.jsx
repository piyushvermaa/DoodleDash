import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const CreateRoom = () => {
  localStorage.removeItem('name');

  const navigate = useNavigate();
  // console.log(localStorage.getItem('name')+"z");
  
  useEffect(() => {
    if (localStorage.getItem('name') === null) {
      console.log(localStorage.getItem('name') + "z");
      navigate('/');
    }
  }, [navigate]);

  const [roomId, setRoomId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [numRounds, setNumRounds] = useState('');
  const [wordsPerRound, setWordsPerRound] = useState('');
  const [timer, setTimer] = useState('');

  const generateRoomId = () => {
    const ID = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var id = ID.charAt(Math.random()*10);
    id+=ID.charAt(Math.random()*10);
    id+=ID.charAt(Math.random()*10);
    id+=ID.charAt(Math.random()*10);
    // this id is to be added in rooms.json in backend
    // with host name
    
    setRoomId(id);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const createRoom = () => {
    // Check if Room ID, number of rounds, words per round, and timer are filled
    if (!roomId || !numRounds || !wordsPerRound || !timer) {
      alert('Please generate a Room ID and fill in all fields.');
      return;
    }
    // Add logic to create a room
    console.log(`Room Created with ID: ${roomId}`);
    // roomId is roomId and playerName is localStorage.get('name')
    const aa = roomId;
    const bb = localStorage.getItem('name');

    

    fetch('https://pictionary-back.onrender.com/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId: aa,
        playerName: bb
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
    


    navigate(`/room/${roomId}`); // Navigate to the waiting room page
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
          <input 
            className='border border-gray-300 p-2 w-full rounded' 
            type="number" 
            placeholder="Enter number of rounds" 
            value={numRounds} 
            onChange={(e) => setNumRounds(e.target.value)} 
          />
        </div>
        <div className='mb-4 w-full'>
          <label className='block mb-2'>Words per Round</label>
          <input 
            className='border border-gray-300 p-2 w-full rounded' 
            type="number" 
            placeholder="Enter words per round" 
            value={wordsPerRound} 
            onChange={(e) => setWordsPerRound(e.target.value)} 
          />
        </div>
        <div className='mb-4 w-full'>
          <label className='block mb-2'>Timer (seconds)</label>
          <input 
            className='border border-gray-300 p-2 w-full rounded' 
            type="number" 
            placeholder="Enter timer in seconds" 
            value={timer} 
            onChange={(e) => setTimer(e.target.value)} 
          />
        </div>
        <button 
          onClick={createRoom} 
          className='bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded w-full'
        >
          Create Room
        </button>
      </div>
    </div>
  );
}

export default CreateRoom;
