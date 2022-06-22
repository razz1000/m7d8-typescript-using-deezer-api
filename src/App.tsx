import React from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Frontpage from "./components/Frontpage";
import SongDetailsPage from "./components/SongDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Frontpage />} />
            <Route path="/:id" element={<SongDetailsPage />} />

            {/*           <Route
            path="/class"
            element={<ClassComponent mainTitle="Hello TS World!" />}
          />
          <Route path="/form" element={<BootstrapComponent />} />
          <Route path="/fetch" element={<FetchComponent />} />
 */}
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
