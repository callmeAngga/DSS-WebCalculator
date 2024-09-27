export function calculateWP(input) {
    const { rows, cols, weights, types, values } = input;

    // Step 1: Input Data
    const steps = [
        {
            title: "Input Data",
            data: {
                "Number of items": rows,
                "Number of criteria": cols,
                Weights: weights,
                Types: types,
                Values: values,
            },
        },
    ];

    // Step 2: Normalisasi Bobot
    const normalizedWeights = normalizeWeights(weights);
    steps.push({
        title: "Normalized Weights",
        data: normalizedWeights,
    });

    // Step 3: Hitung Vektor S
    const vectorS = calculateVectorS(values, normalizedWeights, types);
    steps.push({
        title: "Vector S",
        data: vectorS,
    });

    // Step 4: Hitung Vektor V
    const vectorV = calculateVectorV(vectorS);
    steps.push({
        title: "Vector V",
        data: vectorV,
    });

    // Step 5: Rangking
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

function normalizeWeights(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map((w) => w / sum);
}

function calculateVectorS(values, weights, types) {
    return values.map((row) =>
        row.reduce(
            (acc, val, i) =>
                acc * Math.pow(val, types[i] === "benefit" ? weights[i] : -weights[i]),
            1
        )
    );
}

function calculateVectorV(vectorS) {
    const sum = vectorS.reduce((a, b) => a + b, 0);
    return vectorS.map((s) => s / sum);
}

function rankAlternatives(vectorV) {
    return vectorV
        .map((v, i) => ({ index: i + 1, value: v }))
        .sort((a, b) => b.value - a.value)
        .map((item, index) => ({ ...item, rank: index + 1 }));
}
