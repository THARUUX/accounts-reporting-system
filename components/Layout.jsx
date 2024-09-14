// ./components/Layout.js
import React from 'react';
import Header from './Header'; // Adjust the path as needed

const Layout = ({ children }) => {
  return (
    <div className="antialiased w-screen h-screen bg-white flex">
      <Header />
      <div className="grow h-screen overflow-y-scroll p-5 text-lime-950">
        {children}
      </div>
    </div>
  );
};

export default Layout;
