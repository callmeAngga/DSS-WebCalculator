// topsisMethod.js

export function calculateTOPSIS(input) {
    const { rows, cols, weights, types, values } = input;
    const steps = [
        {
            title: "Input Data",
            data: { rows, cols, weights, types, values },
        },
    ];

    // Step 2: Normalize the decision matrix
    const normalizedMatrix = values.map((row) => {
        const sqrtSum = Math.sqrt(row.reduce((sum, val) => sum + val * val, 0));
        return row.map((val) => val / sqrtSum);
    });
    steps.push({ title: "Normalized Matrix", data: normalizedMatrix });

    // Step 3: Calculate the weighted normalized decision matrix
    const weightedMatrix = normalizedMatrix.map((row) =>
        row.map((val, j) => val * weights[j])
    );
    steps.push({ title: "Weighted Normalized Matrix", data: weightedMatrix });

    // Step 4: Determine the ideal and negative-ideal solutions
    const ideal = weightedMatrix[0].map((_, j) =>
        types[j] === "benefit"
            ? Math.max(...weightedMatrix.map((r) => r[j]))
            : Math.min(...weightedMatrix.map((r) => r[j]))
    );
    const negativeIdeal = weightedMatrix[0].map((_, j) =>
        types[j] === "benefit"
            ? Math.min(...weightedMatrix.map((r) => r[j]))
            : Math.max(...weightedMatrix.map((r) => r[j]))
    );
    steps.push({ title: "Ideal Solution", data: ideal });
    steps.push({ title: "Negative-Ideal Solution", data: negativeIdeal });

    // Step 5: Calculate the separation measures
    const separation = weightedMatrix.map((row) => {
        const sPlus = Math.sqrt(
            row.reduce((sum, val, j) => sum + Math.pow(val - ideal[j], 2), 0)
        );
        const sMinus = Math.sqrt(
            row.reduce((sum, val, j) => sum + Math.pow(val - negativeIdeal[j], 2), 0)
        );
        return { sPlus, sMinus };
    });
    steps.push({ title: "Separation Measures", data: separation });

    // Step 6: Calculate the relative closeness to the ideal solution
    const relativeCloseness = separation.map(
        ({ sPlus, sMinus }) => sMinus / (sPlus + sMinus)
    );
    steps.push({ title: "Relative Closeness", data: relativeCloseness });

    // Step 7: Ranking
    const ranking = relativeCloseness
        .map((v, i) => ({ index: i + 1, value: v }))
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({ ...item, rank: index + 1 }));
    steps.push({ title: "Final Ranking", data: ranking });

    return { steps, result: ranking };
}
