export default function ProductDescription(props) {
  const { description } = props;

  return (
    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6 bg-peach rounded-md px-4 mb-5 h-auto">
      <div>
        <div className="text-xl mb-3 font-bold">Description</div>
        <div className="space-y-6 ml-5">
          <ul className="list-disc list-inside ml-3">
            {description.split('\n').map((line, index) => (
              <li
                key={index}
                className="text-base text-gray-900"
                style={{ textAlign: 'justify' }}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
