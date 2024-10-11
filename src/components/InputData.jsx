import React, { useState, useRef, useEffect } from "react";

const InputData = ({ onCalculate, method }) => {
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    const [tableData, setTableData] = useState([]);
    const [weights, setWeights] = useState([]);
    const [types, setTypes] = useState([]);
    const [pairwiseComparisons, setPairwiseComparisons] = useState([]);
    const [subcriteriaPairwiseComparisons, setSubcriteriaPairwiseComparisons] = useState(Array(cols).fill([])
    );
    const inputRefs = useRef([]);

    const incrementRows = () => setRows(rows + 1);
    const decrementRows = () => setRows(rows - 1);
    const incrementCols = () => setCols(cols + 1);
    const decrementCols = () => setCols(cols - 1);

    useEffect(() => {
        generateTable();
    }, [rows, cols]);

    const generateTable = () => {
        const newTableData = Array(rows).fill(0).map(() => Array(cols).fill(0));
        setTableData(newTableData);
        setWeights(Array(cols).fill(0));
        setTypes(Array(cols).fill('benefit'));
        setPairwiseComparisons([]);
        setSubcriteriaPairwiseComparisons(Array.from({ length: cols }, () => Array.from({ length: rows }, () => Array(rows).fill(1))));
    };

    const handleInputChange = (e, rowIndex, colIndex) => {
        const newData = [...tableData];
        newData[rowIndex][colIndex] = Number(e.target.value);
        setTableData(newData);
    };

    const handleWeightChange = (e, index) => {
        const newWeights = [...weights];
        newWeights[index] = Number(e.target.value);
        setWeights(newWeights);
    };

    const handleTypeChange = (e, index) => {
        const newTypes = [...types];
        newTypes[index] = e.target.value;
        setTypes(newTypes);
    };

    const handleReset = () => {
        generateTable();
    };

    const handlePairwiseComparisonChange = (e, criterionA, criterionB) => {
        const newComparisons = [...pairwiseComparisons];
        let value = e.target.value;

        if (value.includes('/')) {
            const [numerator, denominator] = value.split('/');
            value = Number(numerator) / Number(denominator);
        } else {
            value = Number(value);
        }

        const existingComparisonAtoB = newComparisons.find(
            comp => comp.criterionA === criterionA && comp.criterionB === criterionB
        );

        if (existingComparisonAtoB) {
            existingComparisonAtoB.value = value;
        } else {
            newComparisons.push({
                criterionA,
                criterionB,
                value,
            });
        }

        const existingComparisonBtoA = newComparisons.find(
            comp => comp.criterionA === criterionB && comp.criterionB === criterionA
        );

        if (existingComparisonBtoA) {
            existingComparisonBtoA.value = 1 / value;
        } else {
            newComparisons.push({
                criterionA: criterionB,
                criterionB: criterionA,
                value: 1 / value,
            });
        }

        setPairwiseComparisons(newComparisons);
    };

    const getComparisonValue = (criterionA, criterionB) => {
        const comparison = pairwiseComparisons.find(
            comp => comp.criterionA === criterionA && comp.criterionB === criterionB
        );
        return comparison ? comparison.value : "1";
    };

    const handleSubcriteriaPairwiseComparisonChange = (e, criterionIndex, subA, subB) => {
        const value = e.target.value;
        const newComparisons = [...subcriteriaPairwiseComparisons];

        let comparisonValue;
        if (value.includes('/')) {
            const [numerator, denominator] = value.split('/');
            comparisonValue = Number(numerator) / Number(denominator);
        } else {
            comparisonValue = Number(value);
        }

        newComparisons[criterionIndex][subA][subB] = comparisonValue;
        newComparisons[criterionIndex][subB][subA] = 1 / comparisonValue;

        setSubcriteriaPairwiseComparisons(newComparisons);
    };

    const getSubcriteriaComparisonValue = (criterionIndex, subA, subB) => {
        const value = subcriteriaPairwiseComparisons[criterionIndex]?.[subB]?.[subA];
        return value !== undefined ? value : 1;
    };

    const handleCalculate = () => {
        if (!method) {
            alert('Please select a method before calculating.');
            return;
        }
        let payload;

        if (method === 'AHP') {
            payload = {
                rows,
                cols,
                values: tableData,
                pairWise: pairwiseComparisons,
                subcriteriaPairWise: subcriteriaPairwiseComparisons

            };
        } else {
            payload = {
                rows,
                cols,
                weights,
                types,
                values: tableData
            };
        }

        onCalculate(payload);
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        const currentIndex = rowIndex * cols + colIndex;
        switch (e.key) {
            case 'ArrowUp':
                if (rowIndex > 0) {
                    inputRefs.current[currentIndex - cols].focus();
                }
                break;
            case 'ArrowDown':
                if (rowIndex < rows - 1) {
                    inputRefs.current[currentIndex + cols].focus();
                }
                break;
            case 'ArrowLeft':
                if (colIndex > 0) {
                    inputRefs.current[currentIndex - 1].focus();
                }
                break;
            case 'ArrowRight':
                if (colIndex < cols - 1) {
                    inputRefs.current[currentIndex + 1].focus();
                }
                break;
            default:
                break;
        }
    };

    return (
        <div className="space-y-4 flex flex-col">
            <table className="max-w-20">
                <tr>
                    <td className="text-left pr-2">{method === 'AHP' ? 'Alternatives' : 'Rows'}</td>
                    <td className="pr-2">:</td>
                    <td className="flex items-center space-x-4">
                        <button
                            onClick={decrementRows}
                            disabled={rows <= 2}
                            className={`px-2 py-1 rounded ${rows <= 2 ? 'bg-secondary' : 'bg-primary hover:bg-primaryHover text-accent'}`}
                        >
                            -
                        </button>
                        <span>{rows}</span>
                        <button
                            onClick={incrementRows}
                            disabled={rows >= 10}
                            className={`px-2 py-1 rounded ${rows >= 9 ? 'bg-secondary' : 'bg-primary hover:bg-primaryHover text-accent'}`}
                        >
                            +
                        </button>
                    </td>
                </tr>
                <tr>
                    <td className="text-left pr-2">{method === 'AHP' ? 'Criteria' : 'Columns'}</td>
                    <td className="pr-2">:</td>
                    <td className="flex items-center space-x-4">
                        <button
                            onClick={decrementCols}
                            disabled={cols <= 2}
                            className={`px-2 py-1 rounded ${cols <= 2 ? 'bg-secondary' : 'bg-primary hover:bg-primaryHover text-accent'}`}
                        >
                            -
                        </button>
                        <span>{cols}</span>
                        <button
                            onClick={incrementCols}
                            disabled={cols >= 10}
                            className={`px-2 py-1 rounded ${cols >= 9 ? 'bg-secondary' : 'bg-primary hover:bg-primaryHover text-accent'}`}
                        >
                            +
                        </button>
                    </td>
                </tr>
            </table>
            {/* /*======================================= */}
            {method === "AHP" && (
                <div>
                    <table className="min-w-full text-sm text-accent text-center divide-y divide-accent">
                        <thead className="bg-primary text-accent uppercase tracking-wide text-xs">
                            <tr>
                                <th className="px-7 py-3 border-r border-accent" rowSpan="2">Criteria</th>
                                <th className="px-7 py-3 border-b border-accent" colSpan={cols}>
                                    More Important Comparison
                                </th>
                            </tr>
                            <tr>
                                {Array.from({ length: cols }, (_, i) => i + 1).map(criterion => (
                                    <th key={criterion} scope="col" className="px-7 py-3">
                                        Compare to C{criterion}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-accent">
                            {Array.from({ length: cols }, (_, i) => i + 1).map(criterionA => (
                                <tr key={criterionA} className="border-accent bg-secondary divide-x divide-accent">
                                    <td className="px-7 py-3 whitespace-nowrap font-medium bg-secondary text-accent">
                                        C{criterionA}
                                    </td>
                                    {Array.from({ length: cols }, (_, j) => j + 1).map(criterionB => (
                                        <td key={`${criterionA}-${criterionB}`} className="px-6 py-3">
                                            {criterionA < criterionB ? (
                                                <select
                                                    onChange={(e) => handlePairwiseComparisonChange(e, criterionA, criterionB)}
                                                    className="block w-full text-center bg-secondary focus:outline-none"
                                                >
                                                    <option value="-" selected disabled>Choose</option>
                                                    <option value="1/9">1/9</option>
                                                    <option value="1/8">1/8</option>
                                                    <option value="1/7">1/7</option>
                                                    <option value="1/6">1/6</option>
                                                    <option value="1/5">1/5</option>
                                                    <option value="1/4">1/4</option>
                                                    <option value="1/3">1/3</option>
                                                    <option value="1/2">1/2</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                                    <option value="9">9</option>
                                                </select>
                                            ) : criterionA === criterionB ? (
                                                <span className="text-accent" value="1">1</span>
                                            ) : (
                                                <span className="text-accent">
                                                    {1 / getComparisonValue(criterionB, criterionA)}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />

                    {Array.from({ length: cols }, (_, criterionIndex) => (
                        <div key={criterionIndex}>
                            <h3 className="text-lg font-bold text-accent mb-2">Subcriteria C{criterionIndex + 1}</h3>
                            <table className="min-w-full text-sm text-accent text-center divide-y divide-accent mb-6">
                                <thead className="bg-primary text-accent uppercase tracking-wide text-xs">
                                    <tr>
                                        <th className="px-7 py-3 border-r border-accent" rowSpan="2">Alternative</th>
                                        <th className="px-7 py-3 border-b border-accent" colSpan={rows}>
                                            More Important Comparison
                                        </th>
                                    </tr>
                                    <tr>
                                        {Array.from({ length: rows }, (_, subIndex) => (
                                            <th key={subIndex} className="px-9 py-3">
                                                Compare to A{subIndex + 1}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-accent">
                                    {Array.from({ length: rows }, (_, subA) => (
                                        <tr key={subA} className="border-gray-800 bg-secondary divide-x divide-accent">
                                            <td className="px-7 py-3 whitespace-nowrap font-medium bg-secondary text-accent">
                                                A{subA + 1}
                                            </td>
                                            {Array.from({ length: rows }, (_, subB) => (
                                                <td key={`${subA}-${subB}-${criterionIndex}`} className="px-6 py-3">
                                                    {subA < subB ? (
                                                        <select
                                                            onChange={(e) => handleSubcriteriaPairwiseComparisonChange(e, criterionIndex, subA, subB)}
                                                            className="block w-full text-center bg-secondary focus:outline-none"
                                                        >
                                                            <option value="1/9">1/9</option>
                                                            <option value="1/8">1/8</option>
                                                            <option value="1/7">1/7</option>
                                                            <option value="1/6">1/6</option>
                                                            <option value="1/5">1/5</option>
                                                            <option value="1/4">1/4</option>
                                                            <option value="1/3">1/3</option>
                                                            <option value="1/2">1/2</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="-" selected>Choose</option>
                                                        </select>
                                                    ) : subA === subB ? (
                                                        <span className="text-accent">1</span>
                                                    ) : (
                                                        <span className="text-accent">
                                                            {1 / getSubcriteriaComparisonValue(criterionIndex, subA, subB)}
                                                        </span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                    )
                    }

                </div>
            )}

            {method !== "AHP" && (
                <>
                    <table className="min-w-full text-sm text-accent text-center">
                        <tbody className="divide-y divide-accent">


                            <tr className="border-gray-800 bg-secondary divide-x divide-accent">
                                <td className="px-7 py-3 whitespace-nowrap font-medium bg-primary text-accent">
                                    Type
                                </td>
                                {types.map((type, index) => (
                                    <td key={index} className="px-6 py-3">
                                        <select
                                            value={type}
                                            onChange={(e) => handleTypeChange(e, index)}
                                            className="block w-full text-center bg-secondary focus:outline-none"
                                        >
                                            <option value="benefit">Benefit</option>
                                            <option value="cost">Cost</option>
                                        </select>
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-gray-800 bg-secondary divide-x divide-accent">
                                <td className="px-7 py-3 whitespace-nowrap font-medium bg-primary text-accent">
                                    Weight
                                </td>
                                {weights.map((weight, index) => (
                                    <td key={index} className="px-6 py-3">
                                        <input
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            value={weight}
                                            onChange={(e) => handleWeightChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="block w-full text-center focus:outline-none bg-secondary"
                                        />
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                    <table className="min-w-full text-sm text-accent text-center divide-y divide-accent">
                        <thead className="bg-primary text-accent uppercase tracking-wide text-xs">
                            <tr>
                                <th className="px-9 py-3 border-r border-accent" rowSpan="2">
                                    Item
                                </th>
                                <th className="px-9 py-3 border-b border-accent" colSpan={cols}>
                                    Kriteria
                                </th>
                            </tr>
                            <tr>
                                {Array.from({ length: cols }, (_, index) => (
                                    <th key={index} scope="col" className="px-9 py-3 border-l">
                                        C{index + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-accent">
                            {tableData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-accent bg-secondary divide-x divide-accent">
                                    <th scope="row" className="px-6 py-3 whitespace-nowrap font-medium text-accent">
                                        A{rowIndex + 1}
                                    </th>
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex} className="px-6 py-3">
                                            <input
                                                ref={(el) => (inputRefs.current[rowIndex * cols + colIndex] = el)}
                                                type="text"
                                                value={cell}
                                                onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                                                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                                placeholder="0"
                                                className="block text-center focus:outline-none bg-secondary w-full"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}


            <div className="flex space-x-4">
                <button
                    onClick={handleReset}
                    className="bg-secondary hover:bg-primary text-accent font-bold py-2 px-4 rounded"
                >
                    Reset
                </button>
                <button
                    onClick={handleCalculate}
                    className="bg-primary hover:bg-primaryHover text-accent font-bold py-2 px-4 rounded"
                >
                    Calculate
                </button>
            </div>
        </div>
    );
};

export default InputData;