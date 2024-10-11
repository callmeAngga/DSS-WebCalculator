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
                        headers={["Criteria", "Weight"]}
                        data={step.data.map((value, index) => [
                            `C${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Normalized Matrix":
                return (
                    <Table
                        headers={["Alternative", ...Array.from({ length: step.data[0].length }, (_, i) => `C${i + 1}`)]}
                        data={step.data.map((row, rowIndex) => [
                            `A${rowIndex + 1}`,
                            ...row.map(value => (typeof value === 'number' ? value.toFixed(4) : JSON.stringify(value)))
                        ])}
                    />
                );
            case "Weighted Normalized Matrix":
                return (
                    <Table
                        headers={["Alternative", ...Array.from({ length: step.data[0].length }, (_, i) => `C${i + 1}`)]}
                        data={step.data.map((row, rowIndex) => [
                            `A${rowIndex + 1}`,
                            ...row.map(value => (typeof value === 'number' ? value.toFixed(4) : JSON.stringify(value)))
                        ])}
                    />
                );
            case "Weighted Sum":
                return (
                    <Table
                        headers={["Alternative", "Value"]}
                        data={step.data.map((value, index) => [
                            `C${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Vector S":
                return (
                    <Table
                        headers={["Alternative", "Value"]}
                        data={step.data.map((value, index) => [
                            `A${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Vector V":
                return (
                    <Table
                        headers={["Alternative", "Value"]}
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
                        headers={["Alternative", "D+", "D-"]}
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
                        headers={["Alternative", "Value"]}
                        data={step.data.map((value, index) => [
                            `A${index + 1}`,
                            value.toFixed(4)
                        ])}
                    />
                );
            case "Final Ranking":
                return (
                    <Table
                        headers={["Alternative", "Value", "Rank"]}
                        data={step.data.map((item) => [
                            `A${item.index}`,
                            item.value.toFixed(4),
                            item.rank
                        ])}
                    />
                );
            case "Pairwise Comparison Matrix":
            case "Normalized Pairwise Matrix":
                const criteria = [...new Set(step.data.map(item => item.criterionA))];
                return (
                    <Table
                        headers={["Criteria", ...criteria.map(c => `C${c}`)]} // Add prefix "C" to criteria
                        data={criteria.map(rowCriterion => [
                            `C${rowCriterion}`, // Add prefix "C" to rowCriterion
                            ...criteria.map(colCriterion => {
                                const cell = step.data.find(item => item.criterionA === rowCriterion && item.criterionB === colCriterion);
                                return cell ? cell.value.toFixed(4) : "-";
                            })
                        ])}
                    />
                );

            case "Criteria Weights":
                return (
                    <Table
                        headers={["Criteria", "Weight"]} // Original headers remain the same
                        data={Object.entries(step.data).map(([criterion, weight]) => [
                            `C${criterion}`, // Add prefix "C" to criterion
                            weight.toFixed(4)
                        ])}
                    />
                );

            case "Consistency Ratio":
                return (
                    <Table
                        headers={["Measure", "Value"]}
                        data={[
                            ["LAMBDA MAX", step.data.lambdaMax.toFixed(4)],
                            ["CONSISTENCY INDEX", step.data.consistencyIndex.toFixed(4)],
                            ["CONSISTENCY RATIO", step.data.consistencyRatio.toFixed(4)]
                        ]}
                    />
                );

            case step.title.match(/^Normalized Subcriteria Pairwise Matrix \d+$/)?.input:
                const subcriteria = [...new Set(step.data.map(item => item.criterionA))];

                // Find the corresponding "Subcriteria Weights" step
                const subcriteriaWeightsStep = result.steps.find(
                    s => s.title === `Subcriteria Weights ${step.title.match(/\d+/)[0]}`
                );
                const subcriteriaWeights = subcriteriaWeightsStep ? subcriteriaWeightsStep.data : {};

                // Calculate average weights for subcriteria
                const averageWeights = subcriteria.map(rowCriterion => {
                    return subcriteriaWeights[rowCriterion] ? subcriteriaWeights[rowCriterion].toFixed(4) : "0.0000";
                });

                return (
                    <div>
                        <Table
                            headers={["Alternative", ...subcriteria.map(s => `A${s}`), "AVERAGE"]} // Add prefix "A" to subcriteria
                            data={subcriteria.map((rowCriterion, rowIndex) => [
                                `A${rowCriterion}`, // Add prefix "A" to rowCriterion
                                ...subcriteria.map(colCriterion => {
                                    const cell = step.data.find(item => item.criterionA === rowCriterion && item.criterionB === colCriterion);
                                    return cell ? cell.value.toFixed(4) : "0.0000"; // Replace "-" with "0.0000"
                                }),
                                // Add the corresponding weight (average) from Subcriteria Weights
                                averageWeights[rowIndex] // Fill in with actual average weight
                            ])}
                        />
                    </div>
                );


            case "Final Subcriteria Weights":
                return (
                    <Table
                        headers={["Alternative", "Weight"]}
                        data={Object.entries(step.data).map(([subcriteria, weight]) => [
                            subcriteria,
                            weight.toFixed(4)
                        ])}
                    />
                );

            case "Final Ranking AHP":
                return (
                    <Table
                        headers={["Alternative", "Weight", "Rank"]}
                        data={Object.entries(step.data).map(([alternative, item]) => [
                            alternative,
                            item.weight.toFixed(4),
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
        <div className="w-full text-accent">
            {result.steps.filter(step => step.title !== "Input Data" && !/^Subcriteria Weights \d+$/.test(step.title)).map((step, index) => (
                <div key={index} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    {renderStepContent(step)}
                </div>
            ))}
        </div>
    );
};

export default ResultDisplay;