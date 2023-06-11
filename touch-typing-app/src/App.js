import React from 'react';
import TypingBox from './components/TypingBox';
import './components/TypingBox.css';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1 className="typing-title">Touch Typing Practice</h1>
      <TypingBox />
    </div>
  );
};

export default App;
