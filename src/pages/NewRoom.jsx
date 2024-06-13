import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GamePage from './GamePage';
import '../App.css';
/// pehle localStorage me tumhara naam check hoyega, 
/// if exists then auto join nahi to naam dede

const NewRoom = () => {
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false); // Set to true if the user is the host
  const [dataArray, setDataArray] = useState([]); 
  const [hasName, sethasName] = useState(false);
  // const [added, setAdded] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);


  

  const navigate = useNavigate();
  
  const nameFromStorage = localStorage.getItem('name');

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://pictionary-back.onrender.com/getStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: roomId,
          playerName: nameFromStorage
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      
        .then(data => {
          if (data.start === true) {
            
            setStatus(true);
          }else console.log("wait");
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }, 2000); // Ping every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [navigate]);
   
  useEffect(() => {
    const nameFromStorage = localStorage.getItem('name');
    // jaise hi banda aaye check karo wo pehle se hai to nahi

    // /exists pe async call
    
    if (nameFromStorage) {
      sethasName(true);
      // before this fetch req, break if /exists returns true

      
      fetch('https://pictionary-back.onrender.com/exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: roomId,
          playerName: nameFromStorage
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Exists check:', data);
        if (data.exists === false) {
          // If the player does not exist, make the second fetch request to add the player
           fetch('https://pictionary-back.onrender.com/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              roomId: roomId,
              playerName: nameFromStorage
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Add player:', data);
          });
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
      
      // sethasName(true); // Set hasName to true if 'name' exists
      // check if host

        const fetchData = () => {
          fetch('https://pictionary-back.onrender.com/getHost', {
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
            if(data === nameFromStorage) setIsHost(true);
            console.log(data);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        };
    
        fetchData();
      

    }
  }, []);

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
      fetch('https://pictionary-back.onrender.com/getNames', {
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

  if(!status)
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
            /// a request goes to backend 
            /// everyone is switched to game page ?


            fetch('https://pictionary-back.onrender.com/addStart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                roomId: roomId,
                playerName: name
              })
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              console.log("Wait for game to be started .... ");
            })
            .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
            });
            

          }} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300'>
            Start Game
          </button>
        )}
        
        
        
      { hasName ? (<p></p>) : (
        <><input className='mt-3 border border-gray-300 p-2 mb-2 w-full rounded' type="text" 
        placeholder="Enter your username"
        onChange={(e) => setName(e.target.value)
        }
         />
         <button 
            className=' bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded ml-2 w-full' 
            onClick={() => {

              if(name.length!=0) localStorage.setItem('name',name); 
              console.log(localStorage.getItem('name'));
              if(localStorage.getItem('name').length>0) {
                fetch('https://pictionary-back.onrender.com/add', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    roomId: roomId,
                    playerName: name
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
                
                setName(localStorage.getItem('name')); sethasName(true);
              }
              else
              alert("Put a name buddy");
               }}> 
               Save name
          </button>
        </>
        )
         }
      </div>
    </div>
    

  );
  return <><GamePage/></>
}

export default NewRoom;
