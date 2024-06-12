
import './App.css';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
      
    </div>
  );
}

export default App;
