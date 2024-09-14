import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Loader from '@/components/Loader';

export default function Page() {
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const fetchBankList = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bankentry');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setBankList(result);
      setRows(result.map(bank => ({
        ...bank,
        amount1: bank.accountBalance,
        amount2: bank.unrealizedCheques,
      })));
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, []);

  const handleInputChange = (id, field, value) => {
    setRows(rows.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bankentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rows),
      });

      if (response.ok) {
        const result = await response.json();
        //console.log('Upload successful:', result);
        setLoading(false);
      } else {
        console.error('Error uploading data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const printDiv = (divId) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    
    const content = document.getElementById(divId).innerHTML;
  
    printWindow.document.write('<html><head><title>Bank Balance Report</title>');
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    
    printWindow.document.write('<style>');
    printWindow.document.write('@media print { .no-print { display: none; } }');
    printWindow.document.write('*{ color: #000000;}');
    printWindow.document.write('</style>');
  
    printWindow.document.write('</head><body className="p-1">');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
  
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close(); // Close the window after printing
    }, 300);
  }
  

  return (
    <Layout className="w-full text-lime-900">
      {loading && <Loader />}
      <Link href="BankBalance/settings" className="">Settings</Link>
      <header className="w-full text-center py-3 text-xl">BANK BALANCE</header>
      <hr />
      <div className="w-full p-5">
        <div className="text-lg flex font-bold">
          <div className="grow">
            Entry
          </div>
          <button className="bg-slate-900 text-white py-2 px-5 rounded-lg shadow-lg" onClick={() => printDiv('content-to-print')}>
            Print
          </button>
        </div>

        <form className="my-5 flex flex-col gap-10" onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
          <div id="content-to-print">
            <table className='w-full table-auto my-3 rounded-lg ' >
              <thead>
                <tr>
                  <th className='bg-slate-100 text-wrap uppercase border-x-2'>Account Type</th>
                  <th className='bg-slate-100 text-wrap uppercase border-x-2'>Bank Name</th>
                  <th className='bg-slate-100 text-wrap uppercase border-x-2'>Account Balance</th>
                  <th className='bg-slate-100 text-wrap uppercase border-x-2'>Unrealized Cheques</th>
                  <th className='bg-slate-100 text-wrap uppercase border-x-2'>Balance After Unrealized Cheques</th>
                </tr>
              </thead>
              <tbody className="max-h-screen">
              {rows.map((row) => (
                <tr key={row.id} className="">
                  <td className='py-2 text-nowrap text-sm px-3 border-y-2'>{row.accountType}</td>
                  <td className='py-2 text-nowrap text-sm px-3 border-y-2'>{row.bankName}</td>
                  <td className='py-2 text-sm px-3 border-y-2'>
                    <input
                      type="text"
                      value={row.amount1 ? row.amount1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                      onChange={(e) => handleInputChange(row.id, 'amount1', e.target.value.replace(/,/g, ''))}
                      className="text-center focus:outline-none"
                    />
                  </td>
                  <td className='py-2 text-sm px-3 border-y-2'>
                    <input
                      type="text"
                      value={row.amount2 ? row.amount2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                      onChange={(e) => handleInputChange(row.id, 'amount2', e.target.value.replace(/,/g, ''))}
                      className="text-center focus:outline-none"
                    />
                  </td>
                  <td className="text-center border-y-2">
                    {(Number(row.amount1) - Number(row.amount2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}


                <tr className="font-bold">
                    <td className="py-2 text-sm px-3 border-y-2" colSpan="2">Total Bank Balance</td>
                    <td className='py-2 text-center text-sm px-3 border-y-2'>
                      {rows.reduce((sum, row) => sum + parseFloat(row.amount1 || 0), 0).toLocaleString()}
                    </td>
                    <td className='py-2 text-center text-sm px-3 border-y-2'>
                      {rows.reduce((sum, row) => sum + parseFloat(row.amount2 || 0), 0).toLocaleString()}
                    </td>
                    <td className="text-center border-y-2">
                      {rows.reduce((sum, row) => sum + (parseFloat(row.amount1 || 0) - parseFloat(row.amount2 || 0)), 0).toLocaleString()}
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
          <button type="submit" className="bg-lime-500 w-24 text-white py-2 px-4 rounded-lg shadow-lg">SAVE</button>
        </form>
      </div>
    </Layout>
  );
}
