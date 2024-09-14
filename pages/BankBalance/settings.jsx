import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout'
import Loader from '@/components/Loader';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


export default function Settings() {
    const [accountType, setAccountType] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankList, setBankList] = useState([]);
    const [edit, setEdit] = useState('false');
    const [editId, setEditId] = useState('');
    const [loading, setLoading] = useState('false');

    const handleSubmit = async (e) => {
      setLoading('true');
        e.preventDefault();
    
        if(edit === 'true'){
          const response = await fetch('/api/bankbalance', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({editId, accountType, bankName }),
          });

          if (response.ok) {
            fetchBankList();
            setAccountType('');
            setBankName('');
            setLoading('false');
            setEdit('false');
          } else {
            console.error('Error inserting data');
          }

        } else {
          const response = await fetch('/api/bankbalance', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accountType, bankName }),
          });

          if (response.ok) {
            fetchBankList();
            setAccountType('');
            setBankName('');
            setLoading('false');
          } else {
            console.error('Error inserting data');
          }
        }
    
        
      };

      const fetchBankList = async () => {
        setLoading('true');
        try {
          const response = await fetch('/api/bankbalance');
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          //console.log('Fetched result:', result); // Log to check the data
          setBankList(result);
          setLoading('false')
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
      
      useEffect(() => {
        fetchBankList();
      }, []);

      const editBank = async (id) => {
        setLoading('true');
        setEdit('true');
        try {
          const response = await fetch(`/api/bankbalance?id=${id}`, {
            method: 'GET',
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const [result] = await response.json(); // Destructure the array to get the first item
          console.log('Response:', result);

          if (result) {
              const {id, accountType, bankName } = result;
              setAccountType(accountType);
              setBankName(bankName);
              setEditId(id);
              setLoading('false');
          } else {
              console.error('Error fetching data.');
          }
      
        } catch (error) {
          console.error('Error fetching bank data:', error);
        }
      };

      const editCancel = () => {
        setAccountType('');
        setBankName('');
        setEdit('false');
        setEditId('');
      }

      const MySwal = withReactContent(Swal);

      const deleteBank = async (id) => {
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
            const response = await fetch(`/api/bankbalance?id=${id}`, {
              method: 'DELETE',
            });
    
            if (response.ok) {
              MySwal.fire('Deleted!', 'Your bank entry has been deleted.', 'success');
              fetchBankList();
            } else {
              MySwal.fire('Error!', 'There was an error deleting the bank entry.', 'error');
            }
          } catch (error) {
            MySwal.fire('Error!', 'There was an error deleting the bank entry.', 'error');
          }
        }
      };
      

  return (
    <Layout>
      {loading === 'true' ? <Loader/> : ''}
      <header className="w-full text-center py-3 text-xl">BANK BALANCE | Settings</header>
      <hr />
      <div className="w-full p-5">

        <div className="text-lg font-bold">Add Bank</div>

        <form className="my-5 flex gap-10" onSubmit={handleSubmit}>
          <div className="flex gap-10">
            <div className="flex gap-1 flex-col">
              <label htmlFor="accountType">Account Type</label>
              <input
                type='text'
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                id="accountType"
                name="accountType"
                placeholder="Enter the account type"
                className="w-[300px] border border-slate-200 rounded-lg py-2 px-5 outline-none bg-slate-200"
                required
              />
            </div>
            <div className="flex gap-1 flex-col">
              <label htmlFor="bankName">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                id="bankName"
                name="bankName"
                placeholder="Enter the bank name"
                className="w-[300px] border border-slate-200 rounded-lg py-2 px-5 outline-none bg-slate-200"
                required
              />
            </div>
            <div className='flex justify-center gap-5 items-end'>
              <button type='submit' className={`bg-lime-500 text-white py-2 px-3 rounded shadow-md ${edit === 'false' ? '' : 'hidden'}`}>ADD</button>
              <button type='submit' className={`bg-lime-500 text-white py-2 px-3 rounded shadow-md ${edit === 'true' ? '' : 'hidden'}`}>UPDATE</button>
              <button type='button' onClick={() => editCancel()} className={`bg-slate-800 text-white py-2 px-3 rounded shadow-md ${edit === 'true' ? '' : 'hidden'}`}>CANCEL</button>
            </div>
          </div>
        </form>

        <div className="mt-3 text-lg font-bold">List</div>

        <table className='w-full table-auto my-3 '>
          <thead>
            <tr>
              <th className='bg-slate-100'>ID</th>
              <th className='bg-slate-100'>Account Type</th>
              <th className='bg-slate-100'>Bank Name</th>
              <th className='bg-slate-100'>Option</th>
            </tr>
          </thead>
          <tbody>
            {bankList.map((bank, index) => (
              <tr key={index} className="">
                <td className='py-2 text-center'>B{bank.id}</td>
                <td className='py-2'>{bank.accountType}</td>
                <td className='py-2'>{bank.bankName}</td>
                <td className='py-2 flex justify-center gap-5'>
                  <button onClick={() => editBank(bank.id)} className={`py-1 px-2 rounded shadow-lg bg-slate-900 text-white`}>EDIT</button>
                  <button onClick={() => deleteBank(bank.id)} className='py-1 px-2 rounded shadow-lg bg-red-700 text-white'>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
