import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Homepage";
import PersonDetail from "./pages/PersonDetail";
import PersonForm from "./pages/PersonForm";
import Page from "./pages/Page";
import PersonDatabase from "./pages/PersonDatabase";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Page />} >
          <Route index element={<Home />} />
          <Route path="/people">
            <Route path="" element={<PersonDatabase />} />
            <Route path="show/:id" element={<PersonDetail />} />
            <Route path="create" element={<PersonForm />} />
            <Route path="edit/:id" element={<PersonForm />} />
          </Route>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;