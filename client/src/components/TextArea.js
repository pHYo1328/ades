export default function TextArea({ value, func, rows, placeholder }) {
  return (
    <textarea
      className="border border-gray-300 rounded-md py-2 px-3 w-full text-sm"
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={func}
    />
  );
}
