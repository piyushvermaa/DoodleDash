import React, { useRef, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';


const GamePage = ({ stateArray }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [first, setFirst] = useState(false);
  
  const [PX, setPX] = useState(null);
  const [PY, setPY] = useState(null);
  const [socket, setSocket] = useState(null);

  // console.log(stateArray); /// it has names of everyone

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    setCtx(context);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const url = window.location.href;
    const code = url.slice(-4); 
    const ws = new WebSocket(`ws://localhost:8000?code=${code}`);
    setSocket(ws);

    ws.onmessage = (event) => {
      
      const data = JSON.parse(event.data);
      // console.log(event.data);
      if(ctx)
      handleIncomingDrawing(data);
      else console.log(new Date().getSeconds());
    };

    

    return () => {
      ws.close();// Clear interval on component unmount
    };
  }, [ctx]);

  
  const startDrawing = (event) => {
    event.preventDefault();
    const mouseX = getX(event);
    const mouseY = getY(event);

    if (tool === 'fill') {
      fillCanvas();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
  };

  const draw = (event) => {
    event.preventDefault();
    const mouseX = getX(event);
    const mouseY = getY(event);

    if (!isDrawing) return;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;
    }

    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    if (socket && socket.readyState === WebSocket.OPEN) {
      
      // socket.send(JSON.stringify(drawingData));
      const imageData = canvasRef.current.toDataURL(); // Get canvas data as base64 string
      socket.send(JSON.stringify({ imageData }));
    }
    setFirst(true);
    // PX = mouseX;
    setPX(mouseX);
    setPY(mouseY);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    ctx.closePath();
    setPX(null);
    setPY(null);
    saveState();
  };

  const getX = (event) => {
    const canvas = canvasRef.current;
    if (event.type.includes('touch')) {
      return event.touches[0].clientX - canvas.offsetLeft;
    } else {
      return event.clientX - canvas.offsetLeft;
    }
  };

  const getY = (event) => {
    const canvas = canvasRef.current;
    if (event.type.includes('touch')) {
      return event.touches[0].clientY - canvas.offsetTop;
    } else {
      return event.clientY - canvas.offsetTop;
    }
  };

  const fillCanvas = () => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveState();
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack.pop();
    setRedoStack([...redoStack, ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)]);
    ctx.putImageData(previousState, 0, 0);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack.pop();
    setUndoStack([...undoStack, ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)]);
    ctx.putImageData(nextState, 0, 0);
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveState();
  };

  const saveCanvas = () => {
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleIncomingDrawing = (data) => {
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // console.log(context);
    setCtx(context);
    if(!ctx) {
      alert("ruk");
    }else{
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
      image.src = data.imageData;
    }
  }
  const saveState = () => {
    setUndoStack([...undoStack, ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)]);
  };

  return (
    <div className='flex flex-col justify-center items-center w-full h-screen bg-cover bg-center' style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/021/736/713/large_2x/doodle-lines-arrows-circles-and-curves-hand-drawn-design-elements-isolated-on-white-background-for-infographic-illustration-vector.jpg')" }}>
      <h1 className='glow text-[3rem] md:text-[3rem] xs:text-[2rem]'>DoodleDash</h1>
      <div className='w-[90vw] h-[80vh] gap-3 flex bg-[#481c8f] -mt-7 border border-black rounded-lg'>
        {/* Players Section */}
        <div className='h-full w-1/5 p-4'>
          <div className='bg-white border border-black rounded-xl p-5 h-full'>
            <h2 className='text-center text-2xl font-bold mb-4'>Players</h2>
            <ul className='divide-y divide-gray-200'>
              <li className='flex items-center justify-between py-3'>
                <div className='flex items-center space-x-2'>
                  <span className='text-lg font-medium'>1. Player 1</span>
                  <span className='text-yellow-500'>
                    <i className='fas fa-trophy'></i>
                  </span>
                </div>
                <span className='text-lg font-medium text-gray-600'>100 points</span>
              </li>
              <li className='flex items-center justify-between py-3'>
                <div className='flex items-center space-x-2'>
                  <span className='text-lg font-medium'>2. Player 2</span>
                  <span className='text-gray-400'>
                    <i className='fas fa-medal'></i>
                  </span>
                </div>
                <span className='text-lg font-medium text-gray-600'>80 points</span>
              </li>
              <li className='flex items-center justify-between py-3'>
                <div className='flex items-center space-x-2'>
                  <span className='text-lg font-medium'>3. Player 3</span>
                  <span className='text-yellow-800'>
                    <i className='fas fa-medal'></i>
                  </span>
                </div>
                <span className='text-lg font-medium text-gray-600'>60 points</span>
              </li>
              {/* Add more players here */}
              <ul>
        {stateArray.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
            </ul>
          </div>
        </div>


        {/* Canvas Section */}
        <div className='h-full w-[60%] p-4 flex flex-col gap-3'>
        <div className='flex justify-between items-center mb-4 bg-white border border-black py-3 px-5 rounded-lg' id='info-div'>
          <div className='flex items-center space-x-2'>
            <i className='far fa-calendar-alt text-blue-500'></i>
            <span className='text-lg font-medium'>Round: 1</span>
          </div>
          <div className='flex items-center space-x-2'>
            <i className='far fa-lightbulb text-yellow-500'></i>
            <span className='text-lg font-medium'>Hint: _ _ _ _ _   _ _ _ _</span>
          </div>
          <div className='flex items-center space-x-2'>
            <i className='far fa-clock text-green-500'></i>
            <span className='text-lg font-medium'>Time: 60s</span>
          </div>
        </div>
          <canvas
            id='canvas'
            className='border bg-white border-black w-full flex-1 mb-4 rounded-lg'
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          ></canvas>
          <div className='flex justify-around'>
            <button className={`bg-blue-500 text-white px-4 py-2 rounded ${tool === 'brush' ? 'ring-2 ring-white' : ''}`} onClick={() => setTool('brush')}>
              <i className="fas fa-paint-brush"></i>
            </button>
            <button className={`bg-blue-500 text-white px-4 py-2 rounded ${tool === 'eraser' ? 'ring-2 ring-white' : ''}`} onClick={() => setTool('eraser')}>
              <i className="fas fa-eraser"></i>
            </button>
            <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={fillCanvas}>
              <i className="fas fa-fill-drip"></i>
            </button>
            <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={undo}>
              <i className="fas fa-undo-alt"></i>
            </button>
            <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={redo}>
              <i className="fas fa-redo-alt"></i>
            </button>
            <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={clearCanvas}>
              <i className="fas fa-trash-alt"></i>
            </button>
            <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={saveCanvas}>
              <i className="fas fa-save"></i>
            </button>
          </div>
          <div className='flex justify-around mt-4'>
            {/* Color Buttons */}
            <button className='w-8 h-8 rounded-full bg-red-500' onClick={() => setColor('#FF0000')}></button>
            <button className='w-8 h-8 rounded-full bg-green-500' onClick={() => setColor('#00FF00')}></button>
            <button className='w-8 h-8 rounded-full bg-blue-500' onClick={() => setColor('#0000FF')}></button>
            <button className='w-8 h-8 rounded-full bg-yellow-500' onClick={() => setColor('#FFFF00')}></button>
            <button className='w-8 h-8 rounded-full bg-purple-500' onClick={() => setColor('#800080')}></button>
            <button className='w-8 h-8 rounded-full bg-orange-500' onClick={() => setColor('#FFA500')}></button>
            <button className='w-8 h-8 rounded-full bg-pink-500' onClick={() => setColor('#FFC0CB')}></button>
            <button className='w-8 h-8 rounded-full bg-gray-500' onClick={() => setColor('#808080')}></button>
            <input type='color' className='w-8 h-8 rounded-full border border-black' onChange={(e) => setColor(e.target.value)} />
          </div>
        </div>

        {/* Chat Section */}
        <div className='h-full w-[20%] p-4'>
          <div className='bg-white border border-black rounded-lg p-4 h-full'>
            <h2 className='text-center text-2xl font-bold mb-4'>Chat</h2>
            <div className='flex flex-col justify-between h-[92%]'>
            <div className='flex flex-col flex-1 overflow-y-auto mb-3'>
                {/* Chat Messages */}
                <div className='mb-3 flex items-center'>
                  <div className='bg-blue-100 rounded-lg py-2 px-4'>
                    <span className='text-blue-600 font-semibold'>Player 1:</span>
                    <span className='ml-2'>Hello!</span>
                  </div>
                </div>
                <div className='mb-3 flex items-center'>
                  <div className='bg-green-100 rounded-lg py-2 px-4'>
                    <span className='text-green-600 font-semibold'>Player 2:</span>
                    <span className='ml-2'>Hi there!</span>
                  </div>
                </div>
                {/* Add more chat messages here */}
              </div>
              <div className='flex w-[20%]'>
                <input type='text' className='border border-black p-3 flex-1 rounded-lg' placeholder='Type a message...' />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;

