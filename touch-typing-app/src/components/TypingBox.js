import React, { useState, useEffect, useRef } from 'react';
import './TypingBox.css'; // Import your CSS file

const TypingBox = () => {
  const [typedKeys, setTypedKeys] = useState('');
  const [keyCount, setKeyCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [mistakeIndexes, setMistakeIndexes] = useState([]);
  const [nextKeys, setNextKeys] = useState('');
  const [wordsPerMinute, setWordsPerMinute] = useState(0);

  const paragraphText = 'The sun slowly rose over the horizon, casting a warm golden glow on the sleepy town below. But despite what you might think, ‘irregardless’ isn’t a synonym!';
  const words = paragraphText.split(' ');

  const textareaRef = useRef(null);
  const [startTime, setStartTime] = useState(0);

  const handleKeyPress = (event) => {
    const pressedKey = event.key;
    setTypedKeys((prevTypedKeys) => prevTypedKeys + pressedKey);
    setKeyCount((prevKeyCount) => prevKeyCount + 1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      setTypedKeys((prevTypedKeys) => prevTypedKeys.slice(0, -1));
    }
  };

  const handleInput = () => {
    checkMistakes();
    setNextKeys(getNextKeys());
  };

  const handleTimeChange = (event) => {
    const time = Number(event.target.value);

    if (selectedTime !== time) {
      setSelectedTime(time);

      if (timerStarted) {
        setRemainingTime(time);
      }
    }
  };

  const handleStart = () => {
    if (selectedTime > 0) {
      setStartTime(Date.now()); // Set the start time
      setRemainingTime(selectedTime);
      setTimerStarted(true);
      textareaRef.current.focus();
    }
  };

  const handleStop = () => {
    setTimerStarted(false);
    calculateAccuracy(); // Calculate accuracy when the timer stops
    calculateWPM(); // Calculate WPM when the timer stops
  };

  const checkMistakes = () => {
    const typedChars = typedKeys.trim().split('');
    const newMistakeIndexes = [];

    for (let i = 0; i < typedChars.length; i++) {
      if (typedChars[i] !== paragraphText[i]) {
        newMistakeIndexes.push(i);
      }
    }

    setMistakeIndexes(newMistakeIndexes);
  };

  const getNextKeys = () => {
    const typedWords = typedKeys.trim().split(' ');
    const lastTypedWord = typedWords[typedWords.length - 1];
    const currentWord = words[typedWords.length - 1];

    if (lastTypedWord === currentWord) {
      return words[typedWords.length] || '';
    }

    return currentWord;
  };

  const calculateAccuracy = () => {
    const typedChars = typedKeys.trim().split('');
    const newMistakeIndexes = mistakeIndexes;

    const newAccuracy = typedChars.length > 0 ? ((typedChars.length - newMistakeIndexes.length) / typedChars.length) * 100 : 0;
    setAccuracy(newAccuracy);
  };

  const calculateWPM = () => {
    const typedWords = typedKeys.trim().split(' ');
    const elapsedTime = (Date.now() - startTime) / 1000; // Elapsed time in seconds
    const minutes = elapsedTime / 60;
    const wpm = Math.round(typedWords.length / minutes);
    setWordsPerMinute(wpm);
  };

  useEffect(() => {
    if (timerStarted && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            setTimerStarted(false); // Stop the timer
            calculateAccuracy(); // Calculate accuracy when the timer ends
            calculateWPM(); // Calculate WPM when the timer ends
          }
          return newTime;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [timerStarted, remainingTime]);

  useEffect(() => {
    setNextKeys(getNextKeys());
  }, [typedKeys]);

  return (
    <div className="typing-box-container"> {/* Add a container class */}
      <div className="time-selection">
        <label>
          Select Time:
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value={60}
            checked={selectedTime === 60}
            onChange={handleTimeChange}
          />
          1 minute
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value={180}
            checked={selectedTime === 180}
            onChange={handleTimeChange}
          />
          3 minutes
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value={300}
            checked={selectedTime === 300}
            onChange={handleTimeChange}
          />
          5 minutes
        </label>
      </div>
      <div>
        <button onClick={handleStart} disabled={timerStarted}>
          Start
        </button>
        <button onClick={handleStop} disabled={!timerStarted}>
          Stop
        </button>
      </div>
      <p>Next keys: {nextKeys}</p>
      <p>Key Count: {keyCount}</p>
      <p>Accuracy: {accuracy.toFixed(2)}%</p> {/* Display accuracy with 2 decimal places */}
      <p>Time remaining: {remainingTime} seconds</p>
      <p>Words Per Minute (WPM): {wordsPerMinute}</p>
      <p><hr></hr>
        {paragraphText.split('').map((char, index) => (
          <span
            key={index}
            style={{
              color: mistakeIndexes.includes(index) ? 'red' : 'inherit',
              fontWeight: index < typedKeys.length ? 'bold' : 'normal',
              fontSize: 20,
            }}
          >
            {char}
          </span>
        ))}
      </p>
      <textarea
      className="textarea"
        rows={6}
        cols={100}
        autoFocus
        ref={textareaRef}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={!timerStarted || remainingTime <= 0}
      ></textarea>
    </div>
  );
};

export default TypingBox;
