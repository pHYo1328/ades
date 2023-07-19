import { Link } from 'react-router-dom';
export default function LinkButton({ linkTo, content }) {
  return (
    <Link
      to={linkTo}
      className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-md w-full text-sm h-full flex items-center justify-center text-center"
    >
      {content}
    </Link>
  );
}
