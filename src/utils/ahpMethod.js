export function calculateAHP(input) {
    const { rows, cols, values, pairWise, subcriteriaPairWise } = input;

    const steps = [
        {
            title: "Input Data",
            data: { rows, cols, values, pairWise, subcriteriaPairWise },
        },
    ];

    // Step 2: Pairwise Comparison Matrix for main criteria
    const pairwiseMatrix = ensureCompletePairwiseMatrix(pairWise);
    steps.push({
        title: "Pairwise Comparison Matrix",
        data: pairwiseMatrix,
    });

    // Step 3: Normalize Pairwise Matrix for main criteria
    const normalizedPairwiseMatrix = normalizeMatrixAHP(pairwiseMatrix);
    steps.push({
        title: "Normalized Pairwise Matrix",
        data: normalizedPairwiseMatrix,
    });

    // Step 4: Calculate Criteria Weights (Eigenvector)
    const criteriaWeights = calculateWeights(normalizedPairwiseMatrix);
    steps.push({
        title: "Criteria Weights",
        data: criteriaWeights,
    });

    // Step 5: Calculate Consistency Ratio for main criteria
    const consistencyRatio = calculateConsistencyRatio(pairwiseMatrix, criteriaWeights, subcriteriaPairWise);
    steps.push({
        title: "Consistency Ratio",
        data: consistencyRatio,
    });

    // Step 6: Calculate Subcriteria Weights without Consistency Ratios

    const subcriteriaResults = subcriteriaPairWise.map((subMatrix, index) => {
        // Step 6.1: Normalize the subcriteria pairwise matrix
        const normalizedSubMatrix = normalizeMatrixAHP(convertToPairwiseObject(subMatrix));
        steps.push({
            title: `Normalized Subcriteria Pairwise Matrix ${index + 1}`,
            data: normalizedSubMatrix,
        });

        // Step 6.2: Calculate weights for the subcriteria
        const subcriteriaWeights = calculateWeights(normalizedSubMatrix);


        steps.push({
            title: `Subcriteria Weights ${index + 1}`,
            data: subcriteriaWeights,
        });
        return subcriteriaWeights;
    });

    console.log("criteria weight :", criteriaWeights)
    console.log("SUBcriteria weight :", subcriteriaResults)

    const aggregatedWeights = calculateAggregateSubcriteriaWeights(criteriaWeights, subcriteriaResults);
    const FinalWeights = aggregateFinalWeights(aggregatedWeights)
    steps.push({
        title: "Final Subcriteria Weights",
        data: FinalWeights,
    });


    // Step 9: Rank the final scores
    const ranking = rankAlternatives(FinalWeights);
    steps.push({
        title: "Final Ranking AHP",
        data: ranking,
    });

    // Return the detailed steps and the ranking result
    return {
        steps,
        result: ranking,
    };

}

function ensureCompletePairwiseMatrix(pairWise) {
    const criteria = new Set();
    pairWise.forEach(item => {
        criteria.add(item.criterionA);
        criteria.add(item.criterionB);
    });

    const completeMatrix = [];
    criteria.forEach(i => {
        criteria.forEach(j => {
            if (i === j) {
                completeMatrix.push({ criterionA: i, criterionB: j, value: 1 });
            } else {
                const existingComparison = pairWise.find(
                    item => item.criterionA === i && item.criterionB === j
                );
                if (existingComparison) {
                    completeMatrix.push(existingComparison);
                } else {
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

function rankAlternatives(aggregatedWeights) {
    // Ubah objek ke array [key, value] untuk pengurutan
    const weightArray = Object.entries(aggregatedWeights);

    // Urutkan array berdasarkan nilai (value) dari yang terbesar ke terkecil
    weightArray.sort((a, b) => b[1] - a[1]);

    // Format hasil menjadi objek dengan urutan yang diinginkan
    const rankedWeights = {};
    weightArray.forEach(([key, value], index) => {
        rankedWeights[key] = {
            weight: value,
            rank: index + 1 // Menambahkan peringkat (1, 2, 3, ...)
        };
    });

    return rankedWeights;
}

function aggregateFinalWeights(aggregatedWeights) {
    const finalWeights = {};

    // Iterasi melalui semua bobot agregat
    Object.keys(aggregatedWeights).forEach((key) => {
        const [criterion, subcriterion] = key.split('_'); // Memisahkan C1, S1
        // Jika finalWeights untuk subcriterion belum ada, inisialisasi dengan 0
        if (!finalWeights[subcriterion]) {
            finalWeights[subcriterion] = 0;
        }
        // Jumlahkan bobot ke finalWeights berdasarkan subcriterion
        finalWeights[subcriterion] += aggregatedWeights[key];
    });

    return finalWeights;
}

function calculateAggregateSubcriteriaWeights(criteriaWeights, subcriteriaWeights) {
    const aggregateWeights = {};

    // Iterate through each criterion and its subcriteria weights
    Object.keys(criteriaWeights).forEach((criterionKey, index) => {
        const criterionWeight = criteriaWeights[criterionKey];
        const subWeights = subcriteriaWeights[index];

        // Calculate the aggregate weight for each subcriterion under this criterion
        Object.keys(subWeights).forEach((subKey) => {
            // Aggregate weight = criterion weight * subcriterion weight
            const aggregateWeight = criterionWeight * subWeights[subKey];

            // Save the aggregate weight in the result object
            aggregateWeights[`C${index + 1}_A${subKey}`] = aggregateWeight;
        });
    });

    return aggregateWeights;
}

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

function multiplyMatrixByVector(matrix, vector) {
    return matrix.map(row =>
        row.reduce((sum, value, index) => sum + value * vector[index], 0)
    );
}


// Normalize Pairwise Matrix in AHP
function normalizeMatrixAHP(pairWise) {
    // Find all unique criteria to form columns
    const criteria = [...new Set(pairWise.map(item => item.criterionB))];

    // Initialize an object to store the sum of each column
    const columnSums = {};
    criteria.forEach(criterion => {
        columnSums[criterion] = pairWise
            .filter(item => item.criterionB === criterion)
            .reduce((sum, item) => sum + item.value, 0);
    });

    // Normalize each value in pairWise based on the column sum
    const normalizedPairWise = pairWise.map(item => ({
        criterionA: item.criterionA,
        criterionB: item.criterionB,
        value: item.value / columnSums[item.criterionB]
    }));

    return normalizedPairWise;
}


// Calculate Criteria Weights (Eigenvector)
function calculateWeights(normalizedMatrix) {
    // Find all unique criteria (rows) based on criterionA
    const criteria = [...new Set(normalizedMatrix.map(item => item.criterionA))];

    // Initialize an object to store the average (weight) of each row
    const weights = {};
    criteria.forEach(criterion => {
        const rowValues = normalizedMatrix
            .filter(item => item.criterionA === criterion)
            .map(item => item.value);

        // Calculate the average of each row
        const rowAverage = rowValues.reduce((sum, value) => sum + value, 0) / rowValues.length;
        weights[criterion] = rowAverage;
    });

    return weights;
}


// Calculate Consistency Ratio to ensure judgments are consistent
function calculateConsistencyRatio(pairWise, weights, sub) {
    // Find the unique criteria
    const criteria = [...new Set(pairWise.map(item => item.criterionA))];
    const n = criteria.length;

    // Calculate lambda max (λ_max)
    let lambdaMax = 0;
    criteria.forEach(criterion => {
        // Get all values for the current criterion (row) and multiply by corresponding weights
        const rowSum = pairWise
            .filter(item => item.criterionA === criterion)
            .reduce((sum, item) => sum + item.value * weights[item.criterionB], 0);

        // Divide the sum by the weight of the criterion
        lambdaMax += rowSum / weights[criterion];
    });
    lambdaMax /= n;

    // Calculate the Consistency Index (CI)
    const CI = (lambdaMax - n) / (n - 1);

    // Get the Random Consistency Index (RI) using the function you created
    const RI = getRandomIndex(n);

    // Calculate the Consistency Ratio (CR)
    const CR = CI / RI;
    console.log(sub)
    return {
        lambdaMax: lambdaMax,
        consistencyIndex: CI,
        consistencyRatio: CR
    };
}

// Random Consistency Index values based on matrix size
function getRandomIndex(size) {
    const randomIndexValues = {
        1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24,
        7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
    };
    return randomIndexValues[size] || 1.49; // Return 1.49 for sizes > 10
}