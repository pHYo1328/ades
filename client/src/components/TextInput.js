import React from 'react';
export default function TextInput({
  placeholder,
  value,
  func,
  buttonRef,
  defaultValue = null,
}) {
  return (
    <input
      type="text"
      className="border border-gray-300 rounded-md py-2 px-3 w-full"
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={func}
      onKeyDown={
        buttonRef &&
        ((event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            buttonRef.current.click();
          }
        })
      }
    />
  );
}
