// src/App.js
import React from "react";
import "./App.css";
import "./components/ImageToText.css";
import ImageToText from "./components/ImageToText";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Image to Text Converter</h1>
      </header>
      <main>
        <ImageToText />
      </main>
    </div>
  );
}

export default App;
