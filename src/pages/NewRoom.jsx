import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
/// pehle localStorage me tumhara naam check hoyega, 
/// if exists then auto join nahi to naam dede

const NewRoom = () => {
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(true); // Set to true if the user is the host
  const [dataArray, setDataArray] = useState([]); 

  useEffect(() => {
    const fetchPlayers = () => {
      setPlayers(Array.from({ length: 25 }, (_, i) => `Player ${i + 1}`)); // mock players
    };

    fetchPlayers();

    const interval = setInterval(fetchPlayers, 5000); // Fetching players every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8000/getNames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: roomId,
          playerName: "bb"
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.length);
        setDataArray(data); 
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetching data every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [roomId]);

  return (
    <div className='bg-cover bg-center min-h-screen flex flex-col justify-center items-center overflow-hidden' style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/021/736/713/large_2x/doodle-lines-arrows-circles-and-curves-hand-drawn-design-elements-isolated-on-white-background-for-infographic-illustration-vector.jpg')" }}>
      <h1 className='glow mb-10 md:text-[6rem] xs:text-[4rem]'>Waiting Room</h1>
      <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg flex flex-col justify-center items-center w-4/5 max-w-md border border-black'>
        <h2 className='text-2xl font-bold mb-4'>Players in the Room:</h2>
        <div className='overflow-y-auto max-h-[30vh] bg-gray-200 p-4 w-full rounded-lg shadow-inner mb-4'>
          <ul className='list-none'>
            {dataArray.slice(0, 20).map((player, index) => (
              <li key={index} className='p-2 bg-white rounded shadow mb-2'>{player}</li>
            ))}
          </ul>
        </div>
        {isHost && (
          <button onClick={()=>{
            console.log("started")
          }} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300'>
            Start Game
          </button>
        )}
        <h1>{roomId}</h1>
      </div>
    </div>
  );
}

export default NewRoom;
