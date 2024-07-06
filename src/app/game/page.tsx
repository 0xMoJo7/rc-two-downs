'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useMemo } from 'react';
import Link from 'next/link';
import { useTable } from 'react-table';

interface Score {
  [key: number]: (number | string)[][];
}

const GameContent: React.FC = () => {
  const searchParams = useSearchParams();
  const teams = parseInt(searchParams.get('teams') || '4');
  const balls = parseInt(searchParams.get('balls') || '3');
  const betValues = { 1: 20, 2: 10, 3: 10, 4: 10 };

  const [scores, setScores] = useState<Score>(() => {
    const initialScores: Score = {};
    for (let i = 1; i <= teams; i++) {
      initialScores[i] = Array.from({ length: balls }, () => Array(18).fill(''));
    }
    return initialScores;
  });

  const [bets, setBets] = useState<string[]>([]);
  const [totalSum, setTotalSum] = useState<number>(0);

  const updateScore = (team: number, ball: number, hole: number, score: string) => {
    setScores((prevScores) => {
      const newScores = { ...prevScores };
      newScores[team][ball][hole] = score;
      return newScores;
    });
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>, team: number, ball: number, hole: number) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      updateScore(team, ball, hole, value);
    }
  };

  const calculateTotal = (ballScores: (number | string)[]): number => {
    return ballScores.reduce((total, score) => total + (parseInt(score as string) || 0), 0);
  };

  const calculateBets = () => {
    const calculateForRange = (start: number, end: number) => {
      let results: string[] = [];
      let totalSum = 0;

      for (let ball = 0; ball < balls; ball++) {
        for (let i = 1; i <= teams; i++) {
          for (let j = i + 1; j <= teams; j++) {
            let team1Wins = 0;
            let team2Wins = 0;
            let currentBets = [0];

            for (let hole = start; hole <= end; hole++) {
              const team1Score = parseInt(scores[i][ball][hole - 1] as string) || 0;
              const team2Score = parseInt(scores[j][ball][hole - 1] as string) || 0;

              if (team1Score < team2Score) {
                team1Wins++;
                currentBets = currentBets.map(bet => bet + 1);
                if (currentBets[0] === 2) currentBets.unshift(0);
              } else if (team1Score > team2Score) {
                team2Wins++;
                currentBets = currentBets.map(bet => bet - 1);
                currentBets = currentBets.filter(bet => bet >= 0);
              }
            }

            let netWinnings = 0;
            let betSummary = '';
            let betValue = betValues[ball + 1] || 10;

            currentBets.forEach((bet, idx) => {
              if (bet > 0) {
                netWinnings += betValue;
                betSummary += `${bet}-0 `;
              } else if (bet < 0) {
                netWinnings -= betValue;
                betSummary += `0-${Math.abs(bet)} `;
              }
            });

            if (team1Wins > team2Wins && team1Wins - team2Wins === 1 && (end === 9 || end === 18)) {
              netWinnings += betValue;
            }

            totalSum += netWinnings;

            results.push(
              `Ball ${ball + 1} (${betValue}$) Team ${i} vs Team ${j} ` +
              `<span class="font-bold">${team1Wins} - ${team2Wins}</span> -- ` +
              `<span class="${netWinnings > 0 ? 'text-green-500' : 'text-red-500'}">` +
              `${netWinnings}$</span>`
            );
          }
        }
      }

      return { results, totalSum };
    };

    const frontNineBets = calculateForRange(1, 9);
    const backNineBets = calculateForRange(10, 18);
    setBets([...frontNineBets.results, ...backNineBets.results]);
    setTotalSum(frontNineBets.totalSum + backNineBets.totalSum);
  };

  const handleSubmit = () => {
    calculateBets();
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Hole',
        accessor: 'hole',
      },
      ...Array.from({ length: 18 }, (_, i) => ({
        Header: `Hole ${i + 1}`,
        accessor: `hole${i + 1}`,
      })),
      {
        Header: 'Total',
        accessor: 'total',
      },
    ],
    []
  );

  const data = useMemo(() => {
    const tableData: any[] = [];
    Object.keys(scores).forEach((team, teamIndex) => {
      scores[team].forEach((ballScores, ballIndex) => {
        const rowData: any = { hole: `Team ${team} Ball ${ballIndex + 1}` };
        ballScores.forEach((score, holeIndex) => {
          rowData[`hole${holeIndex + 1}`] = (
            <input
              type="text"
              key={`team-${team}-ball-${ballIndex}-hole-${holeIndex}`}
              value={score as string}
              onChange={(e) => handleScoreChange(e, parseInt(team), ballIndex, holeIndex)}
              className="score-input border p-1 rounded text-center text-black"
            />
          );
        });
        const totalScore = calculateTotal(ballScores);
        rowData['total'] = (
          <span className={`font-bold ${totalScore < 70 ? 'text-red-500' : ''}`}>
            {totalScore}
          </span>
        );
        tableData.push(rowData);
      });
      if (teamIndex < Object.keys(scores).length - 1) {
        tableData.push({ spacer: true });
      }
    });
    return tableData;
  }, [scores]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="title">Master Scorecard</h1>
      <div className="table-container">
        <table {...getTableProps()} className="table-auto w-full text-center mb-4">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id} {...column.getHeaderProps()} className="px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              if (row.original.spacer) {
                return (
                  <tr key={`spacer-${row.id}`} className="spacer-row">
                    <td colSpan={20} className="spacer-cell"></td>
                  </tr>
                );
              }
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td key={cell.column.id} {...cell.getCellProps()} className="px-2 py-1 bg-gray-700 text-white text-xs sm:text-sm">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={handleSubmit} className="button max-w-xs">Calculate Bets</button>
      <Link href="/">
        <button className="button max-w-xs mt-4">Back to Game Setup</button>
      </Link>
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold mb-4">Bet Results</h2>
        <ul className="text-center">
          {bets.map((bet, index) => (
            <li key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: bet }}></li>
          ))}
        </ul>
        <h2 className="text-xl font-bold">
          Total won by {totalSum > 0 ? 'Team 1' : 'Team 2'}: <span className={totalSum > 0 ? 'text-green-500' : 'text-red-500'}>${Math.abs(totalSum)}</span>
        </h2>
      </div>
    </div>
  );
};

const Game: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <GameContent />
  </Suspense>
);

export default Game;
