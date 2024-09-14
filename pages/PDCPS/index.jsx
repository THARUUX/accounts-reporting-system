import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Loader from '@/components/Loader';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState('');
  const [total, setTotal] = useState('');
  const [pdcps, setPdcps] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pdcps', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const pdcpsData = await response.json();
      setPdcps(pdcpsData); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data', error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const bodyData = edit 
        ? { editId, bankName, total }
        : { bankName, total };
    
      const response = await fetch('/api/pdcps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
    
      if (response.ok) {
        fetchList();
        setBankName('');
        setTotal('');
        setLoading(false);
        setEdit(false);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setLoading(false);
    }
    
  };

  const MySwal = withReactContent(Swal);

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/pdcps?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          MySwal.fire('Deleted!', 'success');
          fetchList();
        } else {
          MySwal.fire('Error!', 'There was an error deleting.', 'error');
        }
      } catch (error) {
        MySwal.fire('Error!', 'There was an error deleting.', 'error');
      }
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = pdcps.find(pdc => pdc.id === id);
  
    if (itemToEdit) {
      setBankName(itemToEdit.bankName);
      setTotal(itemToEdit.total);
      setEditId(id);
    } else {
      console.error('Item not found');
    }
    setEdit(true);
  };

  const editCancel = () => {
    setEdit(false);
    setBankName('');
    setTotal('');
  }

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
      <header className="w-full text-center py-3 text-xl">PENDING CHEQUE PAYMENT SUMMARY</header>
      <hr />

      <div className="w-full pt-5">
        <div className="font-bold text-lg">Entry</div>
        <div className="border-0 mt-5">
          <form onSubmit={handleSubmit} className="flex gap-5">
            <input 
              value={bankName} 
              onChange={(e) => setBankName(e.target.value)} 
              className="bg-slate-100 px-3 py-1 rounded shadow-lg text-slate-700 focus:outline-none" 
              type="text" 
              placeholder="Bank Name" 
            />
            <input 
              value={total} 
              onChange={(e) => setTotal(e.target.value.replace(/,/g, ''))} 
              className="bg-slate-100 px-3 py-1 rounded shadow-lg text-slate-700 focus:outline-none" 
              type="text" 
              placeholder="Total Rs." 
            />

            {edit ? (
              <>
                <button className={`bg-lime-500 text-white px-3 rounded shadow-lg ${edit ? '' : 'hidden'}`} type="submit">
                  UPDATE
                </button>
                <button onClick={() => editCancel()} className={`bg-slate-800 text-white px-3 rounded shadow-lg ${edit ? '' : 'hidden'}`} type="button">
                  CANCEL
                </button>
              </>
            ) : (
              <button className="bg-lime-500 text-white px-3 rounded shadow-lg" type="submit">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd"/>
                </svg>
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="w-full pt-5">
      <div className="text-lg flex font-bold">
          <div className="grow">
            Entry
          </div>
          <button className="bg-slate-900 text-sm text-white py-2 px-5 rounded-lg shadow-lg" onClick={() => printDiv('content-to-print')}>
            Print
          </button>
        </div>
        <div id="content-to-print" className="mt-5">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3">ID</th>
                <th className="px-3">Bank Name</th>
                <th className="px-3">Total</th>
                <th className="text-center no-print">Option</th>
              </tr>
            </thead>
            <tbody>
              {pdcps.map((pdc) => {
                const formattedTotal = Number(pdc.total).toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                });

                return (
                  <tr key={pdc.id} className="border-b-2">
                    <td className="text-sm px-3">PDC{pdc.id}</td>
                    <td className="text-sm px-3">{pdc.bankName}</td>
                    <td className="text-sm px-3">{formattedTotal}</td>
                    <td className="px-3 flex gap-5 justify-center no-print">
                      <button className="bg-red-500 text-white px-3 py-1 rounded no-print" onClick={() => handleDelete(pdc.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" fill="currentColor" width="24" height="24" viewBox="0 0 30 30">
                          <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                        </svg>
                      </button>
                      <button className="bg-slate-800 text-white px-3 py-1 rounded no-print" onClick={() => handleEdit(pdc.id)}>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                          <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                          <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}

              <tr className="font-bold">
                <td className="py-2 text-sm px-3 border-y-2" colSpan="2">Total PD Cheque Balance</td>
                <td className='py-2 text-sm px-3 border-y-2'>
                  {pdcps.reduce((sum, pdc) => sum + parseFloat(pdc.total || 0), 0).toLocaleString()}
                </td>
                <td className="border-y-2 no-print">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
