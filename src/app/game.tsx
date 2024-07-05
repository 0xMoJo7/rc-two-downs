'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTable } from 'react-table';

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
    ],
    []
  );

  const data = useMemo(() => {
    const tableData: any[] = [];
    Object.keys(scores).forEach((team) => {
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
        tableData.push(rowData);
      });
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
      <div className="space-y-8">
        {Object.keys(scores).map((team) => (
          <div key={team}>
            <h2 className="text-2xl font-bold mb-4">Team {team}</h2>
            {scores[team].map((ballScores, ballIndex) => (
              <div key={ballIndex} className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Ball {ballIndex + 1}</h3>
                <div className="overflow-x-auto">
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
              </div>
            ))}
            <div className="border-b-2 border-gray-600 my-8"></div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="button">Submit Scores</button>
      <Link href="/">
        <button className="button mt-4">Back to Home</button>
      </Link>
    </div>
  );
};

export default Game;
