import React from "react";

const Table = ({ headers, data, inputMode = false, onInputChange, onKeyDown }) => {
    return (
        <table className="min-w-full text-sm text-gray-400 text-center">
            <thead className="bg-gray-800 text-gray-400 uppercase tracking-wide text-xs">
                <tr className="divide-x divide-gray-600">
                    {headers.map((header, index) => (
                        <th key={index} className="px-6 py-3">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-gray-800 bg-gray-700 divide-x divide-gray-600">
                        {row.map((cell, colIndex) => (
                            <td key={colIndex} className="px-6 py-3">
                                {inputMode ? (
                                    <input
                                        type="text"
                                        value={cell}
                                        onChange={(e) => onInputChange(e, rowIndex, colIndex)}
                                        onKeyDown={(e) => onKeyDown(e, rowIndex, colIndex)}
                                        className="block w-full text-center focus:outline-none bg-gray-700"
                                    />
                                ) : (
                                    cell
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;