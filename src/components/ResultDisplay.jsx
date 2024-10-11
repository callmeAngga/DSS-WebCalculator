import React from 'react';
import Table from './Table';

const ResultDisplay = ({ result }) => {
    console.log("RESULT = ", result)
    if (!result) {
        return <p>No calculation results yet. Please use the calculator above.</p>;
    }
    const renderStepContent = (step) => {
        console.log("Rendering step:", step); // Log the full step object
    
        if (!step || !step.data) {
            return <p>No data available for this step.</p>;
        }
    
        console.log("Step data type:", typeof step.data);
        console.log("Step data value:", JSON.stringify(step.data, null, 2));
    
        const isArrayData = Array.isArray(step.data);
    
        // Handle string data
        if (typeof step.data === 'string') {
            return <p>{step.data}</p>;
        }
    
        // Handle empty arrays
        if (isArrayData && step.data.length === 0) {
            return <p>Arr, No data available for this step.</p>;
        }
    
        // Proceed with processing if data is an array or object
        switch (result.method) {
            case 'AHP':
                const isSubcriteriaWeightStep = step.title.includes('Subcriteria Weights');
                const isSubcriteriaMatrixStep = step.title.includes('Subcriteria Pairwise Matrix');
    
                switch (step.title) {
                    case "Pairwise Comparison Matrix":
                    case "Normalized Pairwise Matrix":
                        if (Array.isArray(step.data)) {
                            return (
                                <Table
                                    headers={["Criteria", "Criteria", "Value"]}
                                    data={step.data.map((entry) => [
                                        `C${entry.criterionA}`,
                                        `C${entry.criterionB}`,
                                        entry.value,
                                    ])}
                                />
                            );
                        } else if (typeof step.data === 'object' && step.data !== null) {
                            // If step.data is an object, convert it to an array
                            const dataArray = Object.entries(step.data).map(([key, value]) => ({
                                criterionA: key, // or however you want to handle keys
                                criterionB: value.criterionB, // make sure this matches your object structure
                                value: value.value, // make sure this matches your object structure
                            }));
    
                            return (
                                <Table
                                    headers={["Criteria", "Criteria", "Value"]}
                                    data={dataArray.map((entry) => [
                                        `C${entry.criterionA}`,
                                        `C${entry.criterionB}`,
                                        entry.value,
                                    ])}
                                />
                            );
                        } else {
                            return <p>Invalid data format for this step: expected an array or an object.</p>;
                        }
    
                    case "Criteria Weights":
                        if (typeof step.data === 'object' && !isArrayData) {
                            return (
                                <Table
                                    headers={["Criteria", "Weight"]}
                                    data={Object.entries(step.data).map(([key, value]) => [
                                        `C${key}`, value
                                    ])}
                                />
                            );
                        } else {
                            return <p>Invalid data format for this step: expected an object.</p>;
                        }
                    case "Consistency Ratio":
                        if (typeof step.data === 'object' && !isArrayData) {
                            return (
                                <Table
                                    headers={["Consistency Index", "Consistency Ratio", "Lambda Max"]}
                                    data={[[step.data.consistencyIndex, step.data.consistencyRatio, step.data.lambdaMax]]}
                                />
                            );
                        } else {
                            return <p>Invalid data format for this step: expected an object.</p>;
                        }
                    case "Final Ranking AHP":
                        if (typeof step.data === 'object' && !isArrayData) {
                            return (
                                <Table
                                    headers={["Alternative", "Weight", "Rank"]}
                                    data={Object.entries(step.data).map(([alternative, { weight, rank }]) => [
                                        alternative, weight, rank
                                    ])}
                                />
                            );
                        } else {
                            return <p>Invalid data format for this step: expected an object.</p>;
                        }
                    default:
                        if (isSubcriteriaMatrixStep || isSubcriteriaWeightStep) {
                            if (isArrayData) {
                                return (
                                    <Table
                                        headers={["Criteria", "Criteria", "Value"]}
                                        data={step.data.map((entry) => [
                                            `C${entry.criterionA}`,
                                            `C${entry.criterionB}`,
                                            entry.value
                                        ])}
                                    />
                                );
                            } else if (typeof step.data === 'object') {
                                return (
                                    <Table
                                        headers={["Criteria", "Weight"]}
                                        data={Object.entries(step.data).map(([key, value]) => [
                                            `C${key}`, value
                                        ])}
                                    />
                                );
                            } else {
                                return <p>Invalid data format for this step.</p>;
                            }
                        } else {
                            return (
                                <pre className="bg-gray-700 p-4 rounded-md overflow-x-auto">
                                    {JSON.stringify(step.data, null, 2)}
                                </pre>
                            );
                        }
                }
            default:
            /*============================================================= */
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
        }

    };

    // return (
    //     <div className="w-full text-white">
    //         {result.filter(step => step.title !== "Input Data").map((step, index) => (
    //             <div key={index} className="mb-6">
    //                 <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
    //                 {renderStepContent(step)}
    //             </div>
    //         ))}
    //     </div>
    // );
    return (
        <div className="w-full text-white">
            {result.steps && Array.isArray(result.steps) ? (
                result.steps
                    .filter(step => step.title !== "Input Data")
                    .map((step, index) => (
                        <div key={index} className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            {renderStepContent(step)}
                        </div>
                    ))
            ) : null}

            {/* Render Final Ranking if available */}
            {result.S1 ? (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Final Ranking</h3>
                    <Table
                        headers={["Alternative", "Weight", "Rank"]}
                        data={Object.entries(result).filter(([key]) => key.startsWith('S')).map(([key, { weight, rank }]) => [
                            key,
                            weight.toFixed(4),
                            rank
                        ])}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default ResultDisplay;