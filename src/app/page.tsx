'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [teams, setTeams] = useState<number>(4);
  const [balls, setBalls] = useState<number>(3);
  const [betValues, setBetValues] = useState<{ [key: number]: number }>({ 1: 20, 2: 10, 3: 10, 4: 10 });

  useEffect(() => {
    const newBetValues: { [key: number]: number } = { 1: 20 };
    for (let i = 2; i <= balls; i++) {
      newBetValues[i] = 10;
    }
    setBetValues(newBetValues);
  }, [balls]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="title">RC Auto Two Down Calculator</h1>
      <div className="mb-8 text-center w-full">
        <label className="label block mb-4">Number of Teams:</label>
        <select value={teams} onChange={(e) => setTeams(parseInt(e.target.value))} className="select border p-2 rounded mx-auto">
          {[...Array(6)].map((_, i) => (
            <option key={i + 2} value={i + 2}>
              {i + 2}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-8 text-center w-full">
        <label className="label block mb-4">Number of Balls:</label>
        <select value={balls} onChange={(e) => setBalls(parseInt(e.target.value))} className="select border p-2 rounded mx-auto">
          {[...Array(4)].map((_, i) => (
            <option key={i + 2} value={i + 2}>
              {i + 2}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-8 text-center w-full">
        <h2 className="text-xl font-semibold mb-4">Bet Values</h2>
        {Object.keys(betValues).map(ball => (
          <div key={ball} className="flex items-center justify-center mb-4">
            <label className="mr-2">{ball} Ball:</label>
            <input type="number" value={betValues[parseInt(ball)]} onChange={(e) => setBetValues({ ...betValues, [parseInt(ball)]: parseInt(e.target.value) })} className="input border p-2 rounded w-20 text-center" />
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
