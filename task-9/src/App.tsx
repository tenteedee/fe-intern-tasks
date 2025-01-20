import React, { useState } from 'react';

const pageColors: Record<number, string> = {
  1: 'bg-blue-500',
  2: 'bg-green-500',
  3: 'bg-yellow-500',
  4: 'bg-purple-500',
  5: 'bg-red-500',
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const updateBackgroundColor = (page: number): string => {
    return (
      pageColors[((page - 1) % Object.keys(pageColors).length) + 1] ||
      'bg-gray-500'
    );
  };

  const handlePrev = (): void =>
    setCurrentPage((prev) =>
      prev - 1 < 1 ? Object.keys(pageColors).length : prev - 1
    );
  const handleNext = (): void =>
    setCurrentPage((prev) =>
      prev + 1 > Object.keys(pageColors).length ? 1 : prev + 1
    );
  const handlePageClick = (page: number): void => setCurrentPage(page);

  return (
    <div
      className={`w-screen h-screen ${updateBackgroundColor(
        currentPage
      )} flex flex-col justify-between`}
    >
      <div className='flex justify-center items-center text-white text-6xl h-full'>
        {currentPage}
      </div>
      <div className='controls flex justify-center gap-2 pb-5'>
        <button
          className='px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600'
          onClick={handlePrev}
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
            onClick={() => handlePageClick(parseInt(page))}
          >
            {page}
          </button>
        ))}
        <button
          className='px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600'
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
