import React, { useState } from "react";
import MethodSelector from "./MethodSelector";
import InputData from "./inputData";
import { calculateWP } from "../utils/wpMethod";

const DSSCalculator = ({ onCalculationResult }) => {
  const [method, setMethod] = useState("");

  const handleMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
    if (onCalculationResult) onCalculationResult(null);
  };

  const handleCalculate = (inputData) => {
    if (!method || !inputData) return;

    let calculationResult;
    switch (method) {
      case "SAW":
        alert("COMING SOON");
        break;
      case "WP":
        calculationResult = calculateWP(inputData);
        break;
      case "TOPSIS":
        alert("COMING SOON");
        break;
      case "AHP":
        alert("COMING SOON");
        break;
      default:
        calculationResult = "Invalid method";
    }
    if (onCalculationResult) onCalculationResult(calculationResult);
  };

  return (
    <div className="space-y-4">
      <MethodSelector
        selectedMethod={method}
        onMethodChange={handleMethodChange}
      />
      <InputData onCalculate={handleCalculate} method={method} />
    </div>
  );
};

export default DSSCalculator;
