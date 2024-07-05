'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface Score {
  [key: number]: number[][];
}

const Game: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teams = parseInt(searchParams.get('teams') || '4');
  const balls = parseInt(searchParams.get('balls') || '3');

  const [scores, setScores] = useState<Score>(() => {
    const initialScores: Score = {};
    for (let i = 1; i <= teams; i++) {
      initialScores[i] = Array.from({ length: balls }, () => Array(18).fill(0));
    }
    return initialScores;
  });

  const updateScore = (team: number, ball: number, hole: number, score: number) => {
    setScores((prevScores) => {
      const newScores = { ...prevScores };
      newScores[team][ball][hole] = score;
      return newScores;
    });
  };

  const handleSubmit = () => {
    // Placeholder for submission logic
    console.log('Scores submitted:', scores);
  };

  return (
    <div className="container">
      <h1 className="title">Golf Scorecard</h1>
      {Object.keys(scores).map((team) => (
        <div key={team} className="mb-8 w-full">
          <h2 className="text-2xl font-semibold mb-4">Team {team}</h2>
          {scores[team].map((ballScores, ballIndex) => (
            <div key={ballIndex} className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Ball {ballIndex + 1}</h3>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-center mb-4">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Hole</th>
                      {Array.from({ length: 18 }, (_, i) => (
                        <th key={i} className="px-4 py-2">{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2">Score</td>
                      {ballScores.map((score, holeIndex) => (
                        <td key={holeIndex} className="px-4 py-2">
                          <input
                            type="number"
                            value={score}
                            onChange={(e) => updateScore(parseInt(team), ballIndex, holeIndex, parseInt(e.target.value))}
                            className="input border p-1 rounded w-16 text-center"
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
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
