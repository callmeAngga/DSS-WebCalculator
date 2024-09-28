export function calculateTOPSIS(input) {
    const { rows, cols, weights, types, values } = input;

    // Step 1: Input Data
    const steps = [
        {
            title: "Input Data",
            data: { rows, cols, weights, types, values },
        },
    ];

    // Step 2: Normalisasi Bobot
    const normalizedWeights = normalizeWeights(weights);
    steps.push({
        title: "Normalized Weights",
        data: normalizedWeights,
    });

    // Step 3: Normalisasi Matriks
    const normalizedMatrix = normalizeDecisionMatrix(values);
    steps.push({ 
        title: "Normalized Matrix", 
        data: normalizedMatrix 
    });

    // Step 4: Normalisasi Matrix Terbobot
    const weightedMatrix = calculateWeightedMatrix(normalizedMatrix, normalizedWeights);
    steps.push({ 
        title: "Weighted Normalized Matrix", 
        data: weightedMatrix 
    });

    // Step 5: Tentukan Solusi Ideal dan Negatif-Ideal
    const { ideal, negativeIdeal } = calculateIdealSolutions(weightedMatrix, types);
    steps.push({ 
        title: "Ideal and Negative-Ideal Solutions", 
        data: { ideal, negativeIdeal } 
    });

    // Step 6: Hitung Ukuran Pemisahan
    const separation = calculateSeparationMeasures(weightedMatrix, ideal, negativeIdeal);
    steps.push({ 
        title: "Separation Measures", 
        data: separation 
    });

    // Step 7: Hitung Kedekatan Relatif terhadap Solusi Ideal
    const relativeCloseness = calculateRelativeCloseness(separation);
    steps.push({ 
        title: "Relative Closeness", 
        data: relativeCloseness 
    });

    // Step 8: Ranking
    const ranking = rankAlternatives(relativeCloseness);
    steps.push({ 
        title: "Final Ranking", 
        data: ranking 
    });

    return { 
        steps, 
        result: ranking 
    };
}

function normalizeWeights(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map((w) => w / sum);
}

function normalizeDecisionMatrix(values) {
    return values.map((row) => {
        const sqrtSum = Math.sqrt(row.reduce((sum, val) => sum + val * val, 0));
        return row.map((val) => val / sqrtSum);
    });
}

function calculateWeightedMatrix(normalizedMatrix, weights) {
    return normalizedMatrix.map((row) =>
        row.map((val, j) => val * weights[j])
    );
}

function calculateIdealSolutions(weightedMatrix, types) {
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

    return { ideal, negativeIdeal };
}

function calculateSeparationMeasures(weightedMatrix, ideal, negativeIdeal) {
    return weightedMatrix.map((row) => {
        const dPlus = Math.sqrt(
            row.reduce((sum, val, j) => sum + Math.pow(val - ideal[j], 2), 0)
        );
        const dMinus = Math.sqrt(
            row.reduce((sum, val, j) => sum + Math.pow(val - negativeIdeal[j], 2), 0)
        );
        return { dPlus, dMinus };
    });
}

function calculateRelativeCloseness(separation) {
    return separation.map(
        ({ dPlus, dMinus }) => dMinus / (dPlus + dMinus)
    );
}

function rankAlternatives(relativeCloseness) {
    return relativeCloseness
        .map((v, i) => ({ index: i + 1, value: v }))
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({ ...item, rank: index + 1 }));
}
