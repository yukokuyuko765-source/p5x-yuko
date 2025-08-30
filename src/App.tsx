import React from "react";
import DamageCalculator from "./components/DamageCalculator";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 p-5">
      <DamageCalculator />
    </div>
  );
};

export default App;
