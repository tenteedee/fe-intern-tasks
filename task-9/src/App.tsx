import React, { useState } from 'react';
import Slide from './components/Slide'; // Import Slide component

const pageColors: Record<number, string> = {
  1: 'bg-blue-500',
  2: 'bg-green-500',
  3: 'bg-yellow-500',
  4: 'bg-purple-500',
  5: 'bg-red-500',
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Object.keys(pageColors).length;

  const handlePageChange = (targetPage: number) => {
    if (targetPage >= 1 && targetPage <= totalPages) {
      setCurrentPage(targetPage);
    }
  };

  const handlePrev = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    handlePageChange(currentPage + 1);
  };

  return (
    <div className='w-screen h-screen flex flex-col overflow-hidden'>
      <div className='relative w-full h-full'>
        {Object.keys(pageColors).map((page, index) => (
          <Slide
            key={page}
            content={page}
            color={pageColors[parseInt(page)]}
            index={index + 1}
            currentPage={currentPage}
          />
        ))}
      </div>

      <div className='controls flex justify-center gap-2 pb-5'>
        <button
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-600'
          }`}
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Object.keys(pageColors).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded ${
              parseInt(page) === currentPage
                ? 'bg-gray-800 text-white'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
            onClick={() => handlePageChange(parseInt(page))}
          >
            {page}
          </button>
        ))}
        <button
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-600'
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
