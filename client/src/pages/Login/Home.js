// import { Link } from "react-router-dom";
import React from "react";;
function Home() {
  return (
    <div className="App">
      <header className="">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-5">Home page</h1>
              <div className="flex items-center justify-end mb-5">
                <button className="bg-pink-800 text-white font-bold py-2 px-4 rounded-md mr-3">
                  Sign out
                </button>
                <a
                  href="/login"
                  className="bg-gray-400 text-white font-bold py-2 px-4 rounded-md text-lg"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md text-lg ml-3"
                >
                  Register
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Home;
