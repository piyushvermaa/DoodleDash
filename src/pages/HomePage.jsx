import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Avatar from '../components/Avatar';

const HomePage = () => {
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  return (
    <div className='bg-cover bg-center min-h-screen flex flex-col justify-center items-center  overflow-hidden' style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/021/736/713/large_2x/doodle-lines-arrows-circles-and-curves-hand-drawn-design-elements-isolated-on-white-background-for-infographic-illustration-vector.jpg')" }}>
      <h1 className='glow mb-10 md:text-[6rem] xs:text-[4rem]'>DoodleDash</h1>
      <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg flex flex-col justify-center items-center w-4/5 max-w-md  border border-black'>
        <input className='border border-gray-300 p-2 mb-4 w-full rounded' type="text" 
        placeholder="Enter your username"
        onChange={(e) => setName(e.target.value)}
         />
        <Avatar />
        <div className='flex justify-between w-full'>
        <button 
            className='bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2 w-full' 
            onClick={() => navigate('/join')}>
            Join Room
          </button>
          <button 
            className='bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded ml-2 w-full' 
            onClick={() => {
              if(name.length!=0) localStorage.setItem('name',name); 
              // console.log(localStorage.getItem('name'));
              if(localStorage.getItem('name').length>0) 
              navigate('/create');
              else
              alert("Put a name buddy");
               }}> 
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
