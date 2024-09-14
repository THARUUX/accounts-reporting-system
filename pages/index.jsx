import Image from "next/image";
import Layout from '../components/Layout';
import Link from "next/link";

export default function Home() {
  return (
    <Layout class="w-full">
      <header class="w-full text-center py-3 text-lime-900 text-xl">DASHBOARD</header>
      <hr />
      <div class="w-full p-5">
        <div class="w-full flex flex-wrap gap-10">
          <Link href="/BankBalance" class="bg-lime-300 w-1/6 h-28 text-center px-5 flex justify-center items-center text-lime-900 rounded-lg shadow-xl scale-100 hover:scale-105 ease-out duration-300 cursor-pointer ">Bank Balance</Link>
          <Link href="/PDCPS" class="bg-lime-300 w-1/6 h-28 text-center px-5 flex justify-center items-center text-lime-900 rounded-lg shadow-xl scale-100 hover:scale-105 ease-out duration-300 cursor-pointer ">PD Cheque Payments</Link>
          <Link href="" class="bg-lime-300 w-1/6 h-28 text-center px-5 flex justify-center items-center text-lime-900 rounded-lg shadow-xl scale-100 hover:scale-105 ease-out duration-300 cursor-pointer ">Bank Balance</Link>
          <Link href="" class="bg-lime-300 w-1/6 h-28 text-center px-5 flex justify-center items-center text-lime-900 rounded-lg shadow-xl scale-100 hover:scale-105 ease-out duration-300 cursor-pointer ">Bank Balance</Link>
          <Link href="" class="bg-lime-300 w-1/6 h-28 text-center px-5 flex justify-center items-center text-lime-900 rounded-lg shadow-xl scale-100 hover:scale-105 ease-out duration-300 cursor-pointer ">Bank Balance</Link>
        </div>
      </div>
    </Layout>
  );
}
