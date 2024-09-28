import React from 'react';
import Table from './Table';

const ResultDisplay = ({ result }) => {
    if (!result) {
        return <p>No calculation results yet. Please use the calculator above.</p>;
    }

    const renderStepContent = (step) => {
        switch (step.title) {
            case "Normalized Weights":
                return (
                    <Table
                        headers={["Kriteria", "Weights"]}
                        data={step.data.map((value, index) => [
                            `C${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Normalized Matrix":
                return (
                    <Table
                        headers={["Item", ...Array.from({ length: step.data[0].length }, (_, i) => `C${i + 1}`)]}
                        data={step.data.map((row, rowIndex) => [
                            `A${rowIndex + 1}`,
                            ...row.map(value => (typeof value === 'number' ? value.toFixed(4) : JSON.stringify(value)))
                        ])}
                    />
                );
            case "Weighted Normalized Matrix":
                return (
                    <Table
                        headers={["Item", ...Array.from({ length: step.data[0].length }, (_, i) => `C${i + 1}`)]}
                        data={step.data.map((row, rowIndex) => [
                            `A${rowIndex + 1}`,
                            ...row.map(value => (typeof value === 'number' ? value.toFixed(4) : JSON.stringify(value)))
                        ])}
                    />
                );
            case "Weighted Sum":
                return (
                    <Table
                        headers={["Item", "Value"]}
                        data={step.data.map((value, index) => [
                            `C${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Vector S":
                return (
                    <Table
                        headers={["Item", "Value"]}
                        data={step.data.map((value, index) => [
                            `A${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Vector V":
                return (
                    <Table
                        headers={["Item", "Value"]}
                        data={step.data.map((value, index) => [
                            `A${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Ideal and Negative-Ideal Solutions":
                return (
                    <Table
                        headers={["Type", ...Array.from({ length: step.data.ideal.length }, (_, i) => `C${i + 1}`)]}
                        data={[
                            ["A+", ...step.data.ideal.map(value => value.toFixed(4))],
                            ["A-", ...step.data.negativeIdeal.map(value => value.toFixed(4))]
                        ]}
                    />
                );

            case "Separation Measures":
                return (
                    <Table
                        headers={["Item", "D+", "D-"]}
                        data={step.data.map((value, index) => [
                            `A${index + 1}`,
                            value.dPlus.toFixed(4),
                            value.dMinus.toFixed(4)
                        ])}
                    />
                );
            case "Relative Closeness":
                return (
                    <Table
                        headers={["Item", "Value"]}
                        data={step.data.map((value, index) => [
                            `A${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Final Ranking":
                return (
                    <Table
                        headers={["Item", "Value", "Rank"]}
                        data={step.data.map((item) => [
                            `A${item.index}`,
                            item.value.toFixed(4),
                            item.rank
                        ])}
                    />
                );
            default:
                return (
                    <pre className="bg-gray-700 p-4 rounded-md overflow-x-auto">
                        {JSON.stringify(step.data, null, 2)}
                    </pre>
                );
        }
    };

    return (
        <div className="w-full text-white">
            {result.steps.filter(step => step.title !== "Input Data").map((step, index) => (
                <div key={index} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    {renderStepContent(step)}
                </div>
            ))}
        </div>
    );
};

export default ResultDisplay;