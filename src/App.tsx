import React, { useState, useCallback, useRef, useEffect } from 'react';

interface TimerHistory {
  name: string;
  duration: number;
  color: string;
}

export default function App() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [speakerName, setSpeakerName] = useState('');
  const [history, setHistory] = useState<TimerHistory[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (speakerName.trim() === '') {
      alert('Please enter a speaker name');
      return;
    }
    setIsActive(true);
    intervalRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  }, [speakerName]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Save history only when the timer is stopped
    setHistory((prevHistory) => [
      ...prevHistory,
      { name: speakerName, duration: time, color: backgroundColor },
    ]);

    resetTimer();
  }, [speakerName, time, backgroundColor]);

  const resetTimer = useCallback(() => {
    setTime(0);
    setIsActive(false);
    setSpeakerName('');
    setBackgroundColor('#FFFFFF');
    setIsTimerVisible(true); // Reset timer visibility when resetting
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (time >= 20 && time < 30) {
      setBackgroundColor('#4CAF50'); // Green
    } else if (time >= 30 && time < 40) {
      setBackgroundColor('#FFEB3B'); // Yellow
    } else if (time >= 40) {
      setBackgroundColor('#F44336'); // Red
    }
  }, [time]);

  const categorizeHistory = () => {
    const okay = history.filter((item) => item.duration < 20);
    const good = history.filter((item) => item.duration >= 20 && item.duration < 30);
    const great = history.filter((item) => item.duration >= 30 && item.duration < 40);
    const tooMuch = history.filter((item) => item.duration >= 40);
    return { okay, good, great, tooMuch };
  };

  const { okay, good, great, tooMuch } = categorizeHistory();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6" style={{ backgroundColor }}>
      <h1 className="text-4xl font-bold mb-8 text-center">Toastmasters Timer</h1>
      
      {/* Timer visibility toggle */}
      {isTimerVisible && (
        <div className="text-6xl font-bold mb-8">{formatTime(time)}</div>
      )}
      
      <input
        className="w-full max-w-md px-4 py-2 mb-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        placeholder="Enter speaker's name"
        value={speakerName}
        onChange={(e) => setSpeakerName(e.target.value)}
        disabled={isActive}
      />
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-4 py-2 font-bold text-white bg-blue-500 rounded shadow transition duration-200 ${isActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          onClick={startTimer}
          disabled={isActive}
        >
          Start
        </button>
        <button
          className={`px-4 py-2 font-bold text-white bg-red-500 rounded shadow transition duration-200 ${!isActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
          onClick={stopTimer}
          disabled={!isActive}
        >
          Stop
        </button>
        <button
          className="px-4 py-2 font-bold text-white bg-gray-500 rounded shadow hover:bg-gray-700 transition duration-200"
          onClick={resetTimer}
        >
          Reset
        </button>

        {/* Button to toggle timer visibility */}
        {isActive && (
          <button
            className={`px-4 py-2 font-bold text-white bg-orange-500 rounded shadow hover:bg-orange-700 transition duration-200`}
            onClick={() => setIsTimerVisible((prev) => !prev)}
          >
            {isTimerVisible ? 'Hide Timer' : 'Show Timer'}
          </button>
        )}
      </div>

      {/* Button to toggle history visibility */}
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 font-bold text-white bg-purple-500 rounded shadow hover:bg-purple-700 transition duration-200`}
          onClick={() => setIsHistoryVisible((prev) => !prev)}
        >
          {isHistoryVisible ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {/* History Section */}
      {isHistoryVisible && (
        <div className="w-full max-w-md mt-4 p-4 border border-gray-300 rounded shadow bg-white">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-black">Okay (0-19 seconds)</h3>
              <div className="max-h-40 overflow-y-auto">
                {okay.map((item, index) => (
                  <div key={index} className="p-2 mb-2 rounded bg-gray-100">
                    <span className="font-bold">{item.name}:</span> {formatTime(item.duration)}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-green-600">Good (20-30 seconds)</h3>
              <div className="max-h-40 overflow-y-auto">
                {good.map((item, index) => (
                  <div key={index} className="p-2 mb-2 rounded bg-green-100">
                    <span className="font-bold">{item.name}:</span> {formatTime(item.duration)}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-yellow-600">Great (30-40 seconds)</h3>
              <div className="max-h-40 overflow-y-auto">
                {great.map((item, index) => (
                  <div key={index} className="p-2 mb-2 rounded bg-yellow-100">
                    <span className="font-bold">{item.name}:</span> {formatTime(item.duration)}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-red-600">Too Much (40+ seconds)</h3>
              <div className="max-h-40 overflow-y-auto">
                {tooMuch.map((item, index) => (
                  <div key={index} className="p-2 mb-2 rounded bg-red-100">
                    <span className="font-bold">{item.name}:</span> {formatTime(item.duration)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="mt-8">
  <a
    href="https://github.com/Engineered0" 
    target="_blank"
    rel="noopener noreferrer"
    className="text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:tracking-wider"
  >
    Made by Khaled Ali Ahmed
  </a>
</div>

    </div>
  );
}
