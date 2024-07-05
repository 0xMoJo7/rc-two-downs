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

  const [scores, setScores] = useState<Score>(() => {
    const initialScores: Score = {};
    for (let i = 1; i <= teams; i++) {
      initialScores[i] = Array.from({ length: balls }, () => Array(18).fill(''));
    }
    return initialScores;
  });

  const updateScore = (team: number, ball: number, hole: number, score: string) => {
    setScores((prevScores) => {
      const newScores = { ...prevScores };
      newScores[team][ball][hole] = score;
      return newScores;
    });
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>, team: number, ball: number, hole: number) => {
    const score = e.target.value;
    updateScore(team, ball, hole, score);
  };

  const calculateTotal = (ballScores: (number | string)[]): number => {
    return ballScores.reduce((total, score) => total + (parseInt(score as string) || 0), 0);
  };

  const handleSubmit = () => {
    // Placeholder for submission logic
    console.log('Scores submitted:', scores);
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
              value={score}
              onChange={(e) => handleScoreChange(e, parseInt(team), ballIndex, holeIndex)}
              className="input border p-1 rounded w-full text-center"
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
      <h1 className="title">Golf Scorecard</h1>
      <div className="table-container">
        <table {...getTableProps()} className="table-auto w-full text-center mb-4">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm">
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
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="px-2 py-1 bg-gray-700 text-white text-xs sm:text-sm">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={handleSubmit} className="button">Submit Scores</button>
      <Link href="/">
        <button className="button mt-4">Back to Home</button>
      </Link>
    </div>
  );
};

const Game: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <GameContent />
  </Suspense>
);

export default Game;
