import { Link } from 'react-router-dom';

export default function Breadcrumb({ linkTo, main, value }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to={linkTo}>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-left">
              {main}
            </h2>
          </Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {value}
        </li>
      </ol>
    </nav>
  );
}
