// sawMethod.js

export function calculateSAW(input) {
    const { rows, cols, weights, types, values } = input;
    const steps = [
        {
            title: "Input Data",
            data: { rows, cols, weights, types, values },
        },
    ];

    // Step 2: Normalization
    const normalizedMatrix = values.map(row =>
        row.map((val, j) => {
            if (types[j] === "benefit") {
                return val / Math.max(...values.map(r => r[j]));
            } else {
                return Math.min(...values.map(r => r[j])) / val;
            }
        })
    );
    steps.push({ title: "Normalized Matrix", data: normalizedMatrix });

    // Step 3: Weighted sum
    const weightedSum = normalizedMatrix.map(row =>
        row.reduce((sum, val, j) => sum + val * weights[j], 0)
    );
    steps.push({ title: "Weighted Sum", data: weightedSum });

    // Step 4: Ranking
    const ranking = weightedSum
        .map((v, i) => ({ index: i + 1, value: v }))
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({ ...item, rank: index + 1 }));
    steps.push({ title: "Final Ranking", data: ranking });

    return { steps, result: ranking };
}