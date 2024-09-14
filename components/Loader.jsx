import React from 'react'

export default function Loader() {

  const refreshPage = () => {
    window.location.reload(); // Refresh the current route
  };

  return (
    <div className="fixed bg-white/30 z-50 left-0 top-0 flex w-screen flex-col h-screen justify-center items-center">
      <div class="spinner"></div>
      <div className="bg-white mt-10">Please <button className="text-blue-500" onClick={() => refreshPage()}>Click Here</button> to reload the page</div>
    </div>
  )
}
