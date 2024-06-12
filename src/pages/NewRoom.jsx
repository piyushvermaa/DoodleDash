import React, { useState, useEffect } from 'react';
import '../App.css';

const NewRoom = () => {
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(true); // Set to true if the user is the host

  useEffect(() => {
    const fetchPlayers = () => {
      setPlayers(Array.from({ length: 25 }, (_, i) => `Player ${i + 1}`)); // mock players
    };

    fetchPlayers();

    const interval = setInterval(fetchPlayers, 5000); //fetching players in every 5 sec

    return () => clearInterval(interval);
  }, []);

  const startGame = () => {
    console.log('Game Started');
  };

  return (
    <div className='bg-cover bg-center min-h-screen flex flex-col justify-center items-center overflow-hidden' style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/021/736/713/large_2x/doodle-lines-arrows-circles-and-curves-hand-drawn-design-elements-isolated-on-white-background-for-infographic-illustration-vector.jpg')" }}>
      <h1 className='glow mb-10 md:text-[6rem] xs:text-[4rem]'>Waiting Room</h1>
      <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg flex flex-col justify-center items-center w-4/5 max-w-md border border-black'>
        <h2 className='text-2xl font-bold mb-4'>Players in the Room:</h2>
        <div className='overflow-y-auto max-h-[30vh] bg-gray-200 p-4 w-full rounded-lg shadow-inner mb-4'>
          <ul className='list-none'>
            {players.slice(0, 20).map((player, index) => (
              <li key={index} className='p-2 bg-white rounded shadow mb-2'>{player}</li>
            ))}
          </ul>
        </div>
        {isHost && (
          <button onClick={startGame} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300'>
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}

export default NewRoom;
