import React from "react";
import { Layout } from "./components";
import DamageCalculator from "./components/damageCalculator";

const App: React.FC = () => {
  return (
    <Layout>
      <DamageCalculator />
    </Layout>
  );
};

export default App;
