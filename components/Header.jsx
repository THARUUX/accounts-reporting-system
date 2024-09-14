"use client";

import React from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-w-64 h-screen bg-lime-500">
        <header className="px-2 py-4 w-full tracking-wider text-center text-white border-b-2">
            <div className="text-2xl font-bold">DASHBOARD</div>
            <div className="text-xs tracking-widest uppercase">Neo Graphics (Pvt) Ltd</div>
        </header>
        <div className="w-full p-3 flex flex-col">
          <div className="py-1 flex flex-col gap-1">
            <Link href={'/BankBalance'} className="bg-lime-100 text-lime-700 text-center py-3 rounded-lg cursor-pointer hover:shadow-lg ease-in duration-150 hover:bg-lime-200 hover:text-lime-900">BANK BALANCES</Link>
          </div>
          <div className="py-1 flex flex-col gap-1">
            <Link href={'/PDCPS'} className="bg-lime-100 text-lime-700 text-center py-3 rounded-lg cursor-pointer hover:shadow-lg ease-in duration-150 hover:bg-lime-200 hover:text-lime-900">PD CHEQUES</Link>
          </div>
          <div className="py-1 flex flex-col gap-1">
            <Link href={'/Loans'} className="bg-lime-100 text-lime-700 text-center py-3 rounded-lg cursor-pointer hover:shadow-lg ease-in duration-150 hover:bg-lime-200 hover:text-lime-900">LOANS</Link>
          </div>
        </div>
      <div onClick={handleGoBack} className="fixed right-5 top-5 bg-lime-500 text-white py-2 px-3 rounded-lg shadow-lg cursor-pointer">
      Back
      </div>
    </div>
  )
}
