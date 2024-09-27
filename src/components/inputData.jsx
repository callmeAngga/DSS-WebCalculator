import React, { useState, useRef, useEffect } from "react";

const InputData = ({ onCalculate, method }) => {
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    const [tableData, setTableData] = useState([]);
    const [weights, setWeights] = useState([]);
    const [types, setTypes] = useState([]);
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

    const handleCalculate = () => {
        if (tableData.some(row => row.some(cell => cell === 0)) || weights.some(w => w === 0)) {
            alert('Please fill all input fields before calculating.');
            return;
        }
        if (!method) {
            alert('Please select a method before calculating.');
            return;
        }
        onCalculate({
            rows,
            cols,
            weights,
            types,
            values: tableData
        });
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
                    <td className="text-left pr-2">Rows</td>
                    <td className="pr-2">:</td>
                    <td className="flex items-center space-x-4">
                        <button
                            onClick={decrementRows}
                            disabled={rows <= 2}
                            className={`px-2 py-1 rounded ${rows <= 2 ? 'bg-gray-300' : 'bg-gray-700 hover:bg-gray-800 text-white'}`}
                        >
                            -
                        </button>
                        <span>{rows}</span>
                        <button
                            onClick={incrementRows}
                            disabled={rows >= 10}
                            className={`px-2 py-1 rounded ${rows >= 9 ? 'bg-gray-300' : 'bg-gray-700 hover:bg-gray-800 text-white'}`}
                        >
                            +
                        </button>
                    </td>
                </tr>
                <tr>
                    <td className="text-left pr-2">Columns</td>
                    <td className="pr-2">:</td>
                    <td className="flex items-center space-x-4">
                        <button
                            onClick={decrementCols}
                            disabled={cols <= 2}
                            className={`px-2 py-1 rounded ${cols <= 2 ? 'bg-gray-300' : 'bg-gray-700 hover:bg-gray-800 text-white'}`}
                        >
                            -
                        </button>
                        <span>{cols}</span>
                        <button
                            onClick={incrementCols}
                            disabled={cols >= 10}
                            className={`px-2 py-1 rounded ${cols >= 9 ? 'bg-gray-300' : 'bg-gray-700 hover:bg-gray-800 text-white'}`}
                        >
                            +
                        </button>
                    </td>
                </tr>
            </table>
            <table className="min-w-full text-sm text-gray-400 text-center">
                <tbody className="divide-y divide-gray-600">

                    <tr className="border-gray-800 bg-gray-700 divide-x divide-gray-600">
                        <td className="px-7 py-3 whitespace-nowrap font-medium bg-gray-800 text-gray-400">
                            Type
                        </td>
                        {types.map((type, index) => (
                            <td key={index} className="px-6 py-3">
                                <select
                                    value={type}
                                    onChange={(e) => handleTypeChange(e, index)}
                                    className="block w-full text-center bg-gray-700 focus:outline-none"
                                >
                                    <option value="benefit">Benefit</option>
                                    <option value="cost">Cost</option>
                                </select>
                            </td>
                        ))}
                    </tr>
                    <tr className="border-gray-800 bg-gray-700 divide-x divide-gray-600">
                        <td className="px-7 py-3 whitespace-nowrap font-medium bg-gray-800 text-gray-400">
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
                                    className="block w-full text-center focus:outline-none bg-gray-700"
                                />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <table className="min-w-full text-sm text-gray-400   text-center">
                <thead className=" bg-gray-800 text-gray-400 uppercase tracking-wide text-xs ">
                    <tr className="divide-x divide-gray-600">
                        <th className="px-6 py-3">
                            Criteria
                        </th>
                        {Array(cols).fill().map((_, index) => (
                            <th key={index} scope="col" className=" px-6 py-3">
                                C{index + 1}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-600'>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} className='border-gray-800 bg-gray-700 divide-x divide-gray-600'>
                            <th scope="row" className="px-6 py-3 whitespace-nowrap font-medium text-gray-400">
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
                                        className="block text-center focus:outline-none bg-gray-700 w-full"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex space-x-4">
                <button
                    onClick={handleReset}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Reset
                </button>
                <button
                    onClick={handleCalculate}
                    className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
                >
                    Calculate
                </button>
            </div>
        </div>
    );
};

export default InputData;