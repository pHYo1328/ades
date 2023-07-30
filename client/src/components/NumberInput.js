import React from 'react';
export default function NumberInput({ placeholder, value, func, min = 0 }) {
  return (
    <input
      type="number"
      className="border border-gray-500 border-opacity-75 rounded-md py-2 px-3 w-full"
      placeholder={placeholder}
      value={value}
      onChange={func}
      min={min}
    />
  );
}
