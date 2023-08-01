import React from 'react';
export default function Button({ content, onClick, buttonRef }) {
  return (
    <button
      className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-md w-full text-sm h-full flex items-center justify-center text-center"
      onClick={onClick}
      ref={buttonRef}
    >
      {content}
    </button>
  );
}
