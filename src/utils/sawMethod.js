export function calculateSAW(input) {
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
    const normalizedMatrix = normalizeMatrix(values, types);
    steps.push({
        title: "Normalized Matrix",
        data: normalizedMatrix,
    });

    // Step 4: Hitung Weighted Sum
    const weightedSum = calculateWeightedSum(normalizedMatrix, normalizedWeights);
    steps.push({
         title: "Weighted Sum",
         data: weightedSum,
    });

    // Step 5: Ranking
    const ranking = rankAlternatives(weightedSum);
    steps.push({
        title: "Final Ranking",
        data: ranking,
    });

    return {
        steps,
        result: ranking,
    };
}

// Normalisasi bobot untuk membuat total bobot = 1.
function normalizeWeights(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map((w) => w / sum);
}

// Normalisasi matriks nilai alternatif berdasarkan tipe kriteria 'benefit' atau 'cost'.
function normalizeMatrix(values, types) {
    return values.map(row =>
        row.map((val, j) => {
            return types[j] === "benefit"
                ? val / Math.max(...values.map(r => r[j]))
                : Math.min(...values.map(r => r[j])) / val;
        })
    );
}

// Menghitung jumlah bobot untuk setiap alternatif.
function calculateWeightedSum(normalizedMatrix, weights) {
    return normalizedMatrix.map(row =>
        row.reduce((sum, val, j) => sum + val * weights[j], 0)
    );
}

// Memberi peringkat alternatif berdasarkan hasil 'weighted sum'.
function rankAlternatives(weightedSum) {
    return weightedSum
        .map((v, i) => ({ index: i + 1, value: v }))
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({ ...item, rank: index + 1 }));
}