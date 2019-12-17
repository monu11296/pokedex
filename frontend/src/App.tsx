import React from 'react';
import './App.css';

import Main from './components/main'

import logo from './assets/Pokemon_Logo.png'


const App: React.FC = () => {
  return (
    <div className="App bg-warning font">
    <img src={logo} alt="logo" height="100px" />
      {/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    */}
      <Main />
    </div>
  );
}

export default App;
