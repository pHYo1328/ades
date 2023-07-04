<<<<<<< HEAD
export default function TextInput({
  placeholder,
  name,
  type,
  value,
  func,
  buttonRef,
}) {
  return (
    <input
      type={type}
      name={name}
      className="border border-gray-300 rounded-md py-2 px-3 w-full"
      placeholder={placeholder}
      value={value}
      onChange={func}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          buttonRef.current.click();
        }
      }}
    />
  );
}
=======
export default function TextInput({ placeholder, value, func, buttonRef, defaultValue = null }) {
    return (
        <input
            type="text"
            className="border border-gray-300 rounded-md py-2 px-3 w-full"
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            onChange={func}
            onKeyDown={buttonRef && ((event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    buttonRef.current.click();
                }
            })}
        />
    )
}
>>>>>>> 299adb2c39a96eca140de8b078796cb9aabdd773
