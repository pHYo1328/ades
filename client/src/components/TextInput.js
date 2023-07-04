export default function TextInput({
  placeholder,
  name,
  type,
  value,
  func,
  buttonRef,
  defaultValue = null
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

