import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import TopPage from "./components/TopPage";
import DamageCalculator from "./components/damageCalculator";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/damageCalculator" element={<DamageCalculator />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
