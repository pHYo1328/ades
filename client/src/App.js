import { Routes, Route } from "react-router-dom";
import { ReactDOM } from "react";
import Home from "./pages/Login/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </>
        Hello, we are ready to develop our ades project.

      </header>
    </div>
  );
}

export default App;
