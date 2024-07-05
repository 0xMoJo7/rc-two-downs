'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '../../firebase'; // Firebase configuration file

type Scores = {
  [team: string]: number[];
};

const Game: React.FC = () => {
  const searchParams = useSearchParams();
  const teams = parseInt(searchParams.get('teams') || '2');
  const balls = parseInt(searchParams.get('balls') || '3');

  const initialScores: Scores = {};
  for (let i = 1; i <= teams; i++) {
    initialScores[`team${i}`] = Array(balls).fill(0);
  }

  const [scores, setScores] = useState<Scores>(initialScores);

  const handleScoreUpdate = (team: string, index: number, value: number) => {
    const updatedScores = { ...scores };
    updatedScores[team][index] = value;
    setScores(updatedScores);
    db.collection('scores').doc('game1').set(updatedScores);
  };

  useEffect(() => {
    const unsubscribe = db.collection('scores').doc('game1').onSnapshot((doc) => {
      if (doc.exists) {
        setScores(doc.data() as Scores);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <h1>Game Page</h1>
      {Object.keys(scores).map((team) => (
        <div key={team}>
          <h2>{team.charAt(0).toUpperCase() + team.slice(1)} Scores</h2>
          {scores[team].map((score, index) => (
            <input
              key={index}
              type="number"
              value={score}
              onChange={(e) => handleScoreUpdate(team, index, parseInt(e.target.value))}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Game;
