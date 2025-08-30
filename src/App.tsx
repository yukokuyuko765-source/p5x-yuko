import React from "react";
import CRTExpectationCalculator from "./components/CRTExpectationCalculator";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 p-5">
      <CRTExpectationCalculator />
    </div>
  );
};

export default App;
