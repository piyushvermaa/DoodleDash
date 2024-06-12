
import './App.css';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import CreateRoom from './pages/CreateRoom';
import { Routes, Route } from 'react-router-dom';
import EnterRoom from './pages/EnterRoom';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<EnterRoom />} /> 
      </Routes>
      
    </div>
  );
}

export default App;
