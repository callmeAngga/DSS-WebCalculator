export function calculateWP(input) {
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
    const normalizedMatrix = normalizeMatrix(values, normalizedWeights, types);
    steps.push({
        title: "Normalized Matrix",
        data: normalizedMatrix,
    });

    // Step 4: Hitung Vektor S
    const vectorS = calculateVectorS(normalizedMatrix, types);
    steps.push({
        title: "Vector S",
        data: vectorS,
    });

    // Step 5: Hitung Vektor V
    const vectorV = calculateVectorV(vectorS);
    steps.push({
        title: "Vector V",
        data: vectorV,
    });

    // Step 6: Rangking
    const ranking = rankAlternatives(vectorV);
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
function normalizeMatrix(values, weights, types) {
    return values.map((row) =>
        row.map((val, j) => {
            return types[j] === "benefit" ? Math.pow(val, weights[j]) : Math.pow(val, -weights[j]);
        })
    );
}

// Fungsi untuk menghitung vektor S.
function calculateVectorS(normalizedMatrix, types) {
    return normalizedMatrix.map((row) =>
        row.reduce((acc, val) => acc * val, 1)
    );
}

// Fungsi untuk menghitung vektor V.
function calculateVectorV(vectorS) {
    const sum = vectorS.reduce((a, b) => a + b, 0);
    return vectorS.map((s) => s / sum);
}

// Fungsi untuk meranking alternatif berdasarkan nilai vektor V.
function rankAlternatives(vectorV) {
    return vectorV
        .map((v, i) => ({ index: i + 1, value: v }))
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({ ...item, rank: index + 1 }));
}
