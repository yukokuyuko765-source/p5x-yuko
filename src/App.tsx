import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import TopPage from "./components/TopPage";
import DamageCalculator from "./components/damageCalculator";
import EnemyDefenseEstimator from "./components/enemyDefenseEstimator";
import BattleChartMaker from "./components/battleChartMaker";
import DamageOptimizer from "./components/damageOptimizer";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/damageCalculator" element={<DamageCalculator />} />
          <Route
            path="/enemyDefenseEstimator"
            element={<EnemyDefenseEstimator />}
          />
          <Route path="/battleChartMaker" element={<BattleChartMaker />} />
          <Route path="/damageOptimizer" element={<DamageOptimizer />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
