import React, { useState } from "react";
import MethodSelector from "./MethodSelector";
import InputData from "./InputData";
import { calculateWP } from "../utils/wpMethod";
import { calculateSAW } from "../utils/sawMethod";
import { calculateTOPSIS } from "../utils/topsisMethod";
import { calculateAHP } from "../utils/ahpMethod";

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
                calculationResult = calculateSAW(inputData);
                break;
            case "WP":
                calculationResult = calculateWP(inputData);
                break;
            case "TOPSIS":
                calculationResult = calculateTOPSIS(inputData);
                break;
            case "AHP":
                calculationResult = calculateAHP(inputData);
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
