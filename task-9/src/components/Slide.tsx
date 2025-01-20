import React from 'react';

interface SlideProps {
  content: string | number;
  color: string;
  index: number;
  currentPage: number;
}

const Slide: React.FC<SlideProps> = ({
  content,
  color,
  index,
  currentPage,
}) => {
  return (
    <div
      className={`absolute w-full h-full flex items-center justify-center transition-transform duration-500 ${color}`}
      style={{
        transform: `translateX(${(index - currentPage) * 100}%)`,
      }}
    >
      <h1 className='text-white text-6xl'>{content}</h1>
    </div>
  );
};

export default Slide;
