'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Score {
  [key: number]: number[];
}

const Game: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teams = parseInt(searchParams.get('teams') || '4');
  const balls = parseInt(searchParams.get('balls') || '3');

  const [scores, setScores] = useState<Score>(() => {
    const initialScores: Score = {};
    for (let i = 1; i <= teams; i++) {
      initialScores[i] = Array(balls).fill(0);
    }
    return initialScores;
  });

  const updateScore = (team: number, ball: number, score: number) => {
    setScores((prevScores) => {
      const newScores = { ...prevScores };
      newScores[team][ball - 1] = score;
      return newScores;
    });
  };

  const handleSubmit = () => {
    // Placeholder for submission logic
    console.log('Scores submitted:', scores);
  };

  return (
    <div className="container">
      <h1 className="title">Game Page</h1>
      {Object.keys(scores).map((team) => (
        <div key={team} className="mb-8 w-full">
          <h2 className="text-2xl font-semibold mb-4">Team {team}</h2>
          {scores[team].map((score, index) => (
            <div key={index} className="flex items-center justify-center mb-4">
              <label className="mr-2">{index + 1} Ball:</label>
              <input
                type="number"
                value={score}
                onChange={(e) => updateScore(parseInt(team), index + 1, parseInt(e.target.value))}
                className="input border p-2 rounded w-20 text-center"
              />
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} className="button">Submit Scores</button>
      <Link href="/">
        <button className="button mt-4">Back to Home</button>
      </Link>
    </div>
  );
};

export default Game;
