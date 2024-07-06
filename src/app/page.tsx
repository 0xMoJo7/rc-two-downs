'use client';

import Link from 'next/link';
import { useState } from 'react';

const Home: React.FC = () => {
  const [teams, setTeams] = useState<number>(4);
  const [balls, setBalls] = useState<number>(3);
  const [betValues, setBetValues] = useState<{ [key: number]: number }>({ 1: 20, 2: 10, 3: 10, 4: 10 });

  const handleBallsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBalls = parseInt(e.target.value);
    setBalls(newBalls);
    const newBetValues: { [key: number]: number } = {};
    for (let i = 1; i <= newBalls; i++) {
      newBetValues[i] = betValues[i] || 10;
    }
    setBetValues(newBetValues);
  };

  return (
    <div className="container">
      <h1 className="title">Auto Two Down Calculator</h1>
      <div className="mb-8 text-center w-full">
        <label className="label block mb-4">Number of Teams:</label>
        <select
          value={teams}
          onChange={(e) => setTeams(parseInt(e.target.value))}
          className="input border p-2 rounded mx-auto"
          style={{ width: '120px' }} // Adjust width inline
        >
          {Array.from({ length: 7 }, (_, i) => i + 2).map((teamCount) => (
            <option key={teamCount} value={teamCount}>{teamCount}</option>
          ))}
        </select>
      </div>
      <div className="mb-8 text-center w-full">
        <label className="label block mb-4">Number of Balls:</label>
        <select
          value={balls}
          onChange={handleBallsChange}
          className="input border p-2 rounded mx-auto"
          style={{ width: '120px' }} // Adjust width inline
        >
          {Array.from({ length: 8 }, (_, i) => i + 1).map((ballCount) => (
            <option key={ballCount} value={ballCount}>{ballCount}</option>
          ))}
        </select>
      </div>
      <div className="mb-8 text-center w-full">
        <h2 className="text-xl font-semibold mb-4">Bet Values</h2>
        {Object.keys(betValues).map(ball => (
          <div key={ball} className="flex items-center justify-center mb-4">
            <label className="mr-2">{ball} Ball:</label>
            <input
              type="number"
              value={betValues[parseInt(ball)]}
              onChange={(e) => setBetValues({ ...betValues, [parseInt(ball)]: parseInt(e.target.value) })}
              className="input border p-2 rounded w-20 text-center"
            />
          </div>
        ))}
      </div>
      <Link href={`/game?teams=${teams}&balls=${balls}`}>
        <button className="button">Start Game</button>
      </Link>
    </div>
  );
};

export default Home;
