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
                        headers={["Criteria", "Value"]}
                        data={step.data.map((value, index) => [
                            `C${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Vector S":
                return (
                    <Table
                        headers={["Criteria", "Value"]}
                        data={step.data.map((value, index) => [
                            `C${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Vector V":
                return (
                    <Table
                        headers={["Criteria", "Value"]}
                        data={step.data.map((value, index) => [
                            `C${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Final Ranking":
                return (
                    <Table
                        headers={["Item", "Value", "Rank"]}
                        data={step.data.map((item) => [
                            `C${item.index}`,
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