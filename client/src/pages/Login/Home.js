import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-gray-100">
      <main>
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-5xl font-bold mb-5">Home page</h1>
          <div>button to be removed</div>
          <Link to="/login-admin">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md text-lg">
              Go to Admin Login
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
