import React from "react";

const Table = ({ headers, data, inputMode = false, onInputChange, onKeyDown }) => {
    return (
        <table className="min-w-full text-sm text-accent text-center divide-y divide-accent">
            <thead className="bg-primary text-accent uppercase tracking-wide text-xs">
                <tr className="divide-x divide-accent">
                    {headers.map((header, index) => (
                        <th key={index} className="px-6 py-3">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-accent">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-accent bg-secondary divide-x divide-accent">
                        {row.map((cell, colIndex) => (
                            <td key={colIndex} className="px-6 py-3">
                                {inputMode ? (
                                    <input
                                        type="text"
                                        value={cell}
                                        onChange={(e) => onInputChange(e, rowIndex, colIndex)}
                                        onKeyDown={(e) => onKeyDown(e, rowIndex, colIndex)}
                                        className="block w-full text-center focus:outline-none bg-secondary"
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