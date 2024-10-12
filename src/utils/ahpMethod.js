export function calculateAHP(input) {
    const { rows, cols, values, pairWise, subcriteriaPairWise } = input;

    // Step 1: Input Data
    const steps = [
        {
            title: "Input Data",
            data: { rows, cols, values, pairWise, subcriteriaPairWise },
        },
    ];

    // Step 2: Pairwise Comparison Matrix untuk kriteria utama
    const pairwiseMatrix = ensureCompletePairwiseMatrix(pairWise);
    steps.push({
        title: "Pairwise Comparison Matrix",
        data: pairwiseMatrix,
    });

    // Step 3: Normalisasi Pairwise Matrix
    const normalizedPairwiseMatrix = normalizeMatrixAHP(pairwiseMatrix);
    steps.push({
        title: "Normalized Pairwise Matrix",
        data: normalizedPairwiseMatrix,
    });

    // Step 4: Hitung bobot kriteria (Eigenvector)
    const criteriaWeights = calculateWeights(normalizedPairwiseMatrix);
    steps.push({
        title: "Criteria Weights",
        data: criteriaWeights,
    });

    // Step 5: Hitung Consistency Ratio untuk kriteria utama
    const consistencyRatio = calculateConsistencyRatio(pairwiseMatrix, criteriaWeights, subcriteriaPairWise);
    steps.push({
        title: "Consistency Ratio",
        data: consistencyRatio,
    });

    // Step 6: Hitung bobot subkriteria tanpa memeriksa Consistency Ratio
    const subcriteriaResults = subcriteriaPairWise.map((subMatrix, index) => {
        // Step 6.1: Normalisasi matriks perbandingan berpasangan untuk subkriteria
        const normalizedSubMatrix = normalizeMatrixAHP(convertToPairwiseObject(subMatrix));
        steps.push({
            title: `Normalized Subcriteria Pairwise Matrix ${index + 1}`,
            data: normalizedSubMatrix,
        });

        // Step 6.2: Menghitung bobot untuk subkriteria
        const subcriteriaWeights = calculateWeights(normalizedSubMatrix);
        steps.push({
            title: `Subcriteria Weights ${index + 1}`,
            data: subcriteriaWeights,
        });
        return subcriteriaWeights;
    });

    // Step 7: Menghitung agregasi bobot subkriteria
    const aggregatedWeights = calculateAggregateSubcriteriaWeights(criteriaWeights, subcriteriaResults);

    // Step 8: Menghitung bobot akhir untuk subkriteria
    const FinalWeights = aggregateFinalWeights(aggregatedWeights)
    steps.push({
        title: "Final Subcriteria Weights",
        data: FinalWeights,
    });

    // Step 9: Peringkatkan alternatif berdasarkan bobot akhir
    const ranking = rankAlternatives(FinalWeights);
    steps.push({
        title: "Final Ranking AHP",
        data: ranking,
    });

    return {
        steps,
        result: ranking,
    };

}

// Fungsi untuk memastikan matriks perbandingan berpasangan lengka
function ensureCompletePairwiseMatrix(pairWise) {
    const criteria = new Set();
    pairWise.forEach(item => {
        criteria.add(item.criterionA);
        criteria.add(item.criterionB);
    });

    const completeMatrix = [];
    criteria.forEach(i => {
        criteria.forEach(j => {

            // Jika criterion A dan B sama, maka nilainya 1 (perbandingan dengan dirinya sendiri)
            if (i === j) {
                completeMatrix.push({ criterionA: i, criterionB: j, value: 1 });
            } else {
                // Mencari perbandingan yang sudah ada
                const existingComparison = pairWise.find(
                    item => item.criterionA === i && item.criterionB === j
                );
                if (existingComparison) {
                    completeMatrix.push(existingComparison);
                } else { 
                    // Jika perbandingan tidak ditemukan, gunakan nilai kebalikan dari perbandingan yang ada
                    const reverseComparison = pairWise.find(
                        item => item.criterionA === j && item.criterionB === i
                    );
                    if (reverseComparison) {
                        completeMatrix.push({
                            criterionA: i,
                            criterionB: j,
                            value: 1 / reverseComparison.value
                        });
                    } else {
                        console.warn(`Missing comparison for criteria ${i} and ${j}`);
                    }
                }
            }
        });
    });

    return completeMatrix;
}

// Fungsi untuk mengurutkan alternatif berdasarkan bobot akhir
function rankAlternatives(aggregatedWeights) {
    const weightArray = Object.entries(aggregatedWeights);
    weightArray.sort((a, b) => b[1] - a[1]);
    const rankedWeights = {};
    weightArray.forEach(([key, value], index) => {
        rankedWeights[key] = {
            weight: value,
            rank: index + 1
        };
    });

    return rankedWeights;
}

// Fungsi untuk mengagregasi bobot akhir subkriteria
function aggregateFinalWeights(aggregatedWeights) {
    const finalWeights = {};

    Object.keys(aggregatedWeights).forEach((key) => {
        const [criterion, subcriterion] = key.split('_');
        if (!finalWeights[subcriterion]) {
            finalWeights[subcriterion] = 0;
        }
        finalWeights[subcriterion] += aggregatedWeights[key];
    });

    return finalWeights;
}

// Fungsi untuk menghitung agregasi bobot subkriteria berdasarkan bobot kriteria utama
function calculateAggregateSubcriteriaWeights(criteriaWeights, subcriteriaWeights) {
    const aggregateWeights = {};

    Object.keys(criteriaWeights).forEach((criterionKey, index) => {
        const criterionWeight = criteriaWeights[criterionKey];
        const subWeights = subcriteriaWeights[index];

        Object.keys(subWeights).forEach((subKey) => {
            const aggregateWeight = criterionWeight * subWeights[subKey];
            aggregateWeights[`C${index + 1}_A${subKey}`] = aggregateWeight;
        });
    });

    return aggregateWeights;
}

// Fungsi untuk mengonversi matriks ke dalam objek pairwise
function convertToPairwiseObject(matrix) {
    const pairWiseArray = [];
    matrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            pairWiseArray.push({
                criterionA: rowIndex + 1,
                criterionB: colIndex + 1,
                value: value
            });
        });
    });
    return pairWiseArray;
}

// Fungsi untuk normalisasi matriks perbandingan berpasangan AHP
function normalizeMatrixAHP(pairWise) {
    const criteria = [...new Set(pairWise.map(item => item.criterionB))];

    const columnSums = {};
    criteria.forEach(criterion => {
        columnSums[criterion] = pairWise
            .filter(item => item.criterionB === criterion)
            .reduce((sum, item) => sum + item.value, 0);
    });

    const normalizedPairWise = pairWise.map(item => ({
        criterionA: item.criterionA,
        criterionB: item.criterionB,
        value: item.value / columnSums[item.criterionB]
    }));

    return normalizedPairWise;
}

// Fungsi untuk menghitung bobot kriteria dari matriks perbandingan berpasangan yang sudah dinormalisasi
function calculateWeights(normalizedMatrix) {
    const criteria = [...new Set(normalizedMatrix.map(item => item.criterionA))];

    const weights = {};
    criteria.forEach(criterion => {
        const rowValues = normalizedMatrix
            .filter(item => item.criterionA === criterion)
            .map(item => item.value);

        const rowAverage = rowValues.reduce((sum, value) => sum + value, 0) / rowValues.length;
        weights[criterion] = rowAverage;
    });

    return weights;
}

// Fungsi untuk menghitung Consistency Ratio (Rasio Konsistensi) AHP
function calculateConsistencyRatio(pairWise, weights, sub) {
    const criteria = [...new Set(pairWise.map(item => item.criterionA))];
    const n = criteria.length;

    // Menghitung Lambda max untuk setiap kriteria
    let lambdaMax = 0;
    criteria.forEach(criterion => {
        const rowSum = pairWise
            .filter(item => item.criterionA === criterion)
            .reduce((sum, item) => sum + item.value * weights[item.criterionB], 0);

        lambdaMax += rowSum / weights[criterion];
    });
    lambdaMax /= n;

    const CI = (lambdaMax - n) / (n - 1);       // Menghitung Consistency Index
    const RI = getRandomIndex(n);               // Menggunakan nilai acuan untuk Random Index (RI)
    const CR = CI / RI;                         // Menghitung Consistency Ratio
    console.log(sub)
    return {
        lambdaMax: lambdaMax,
        consistencyIndex: CI,
        consistencyRatio: CR
    };
}

// Fungsi untuk mendapatkan Random Index (RI) dari tabel yang telah ditentukan
function getRandomIndex(size) {
    const randomIndexValues = {
        1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24,
        7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
    };
    return randomIndexValues[size] || 1.49;
}