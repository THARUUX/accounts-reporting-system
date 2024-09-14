import React, { useState } from 'react';
import Loader from '@/components/Loader';
import Layout from '@/components/Layout';

export default function Index() {
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([
    ['A1', 'B1', 'C1', 'D1'],
    ['A2', 'B2', 'C2', 'D2'],
    ['A3', 'B3', 'C3', 'D3'],
    ['A4', 'B4', 'C4', 'D4'],
  ]);

  // Function to update cell data
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  // Function to add a new row
  const addRow = () => {
    const newRow = Array(rows[0].length).fill(''); // Creates an empty row with the same number of columns
    setRows([...rows, newRow]);
  };

  // Function to add a new column
  const addColumn = () => {
    const newRows = rows.map(row => [...row, '']); // Adds an empty column to each row
    setRows(newRows);
  };

  return (
    <Layout>
      {loading && <Loader />}
      <header className="w-full text-center py-3 text-xl">BANK BALANCE | Settings</header>
      <hr />
      <div className="w-full p-5">
        <button onClick={addRow} className="mr-2 bg-blue-500 text-white px-3 py-2 rounded">
          Add Row
        </button>
        <button onClick={addColumn} className="bg-blue-500 text-white px-3 py-2 rounded">
          Add Column
        </button>
        
        <table className="table-auto border-collapse border border-slate-400 mt-4">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-slate-300">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="p-1 w-full text-center"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
