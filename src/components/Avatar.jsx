import React, { useState, useEffect } from 'react';

const Avatar = () => {
  const [avatar, setAvatar] = useState('');

  const fetchRandomAvatar = () => {
    const randomString = Math.random().toString(36).substring(7);
    const timestamp = new Date().getTime();
    setAvatar(`https://robohash.org/${randomString}.png?set=set3&${timestamp}`);
  };

  useEffect(() => {
    fetchRandomAvatar();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {avatar ? (
        <img src={avatar} alt="Avatar" className="w-32 h-32 mb-4 rounded-full" />
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={fetchRandomAvatar} className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-full  mb-4">
        Change Avatar
      </button>
    </div>
  );
};

export default Avatar;
