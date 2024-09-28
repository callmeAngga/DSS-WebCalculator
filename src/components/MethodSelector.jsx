import React from 'react';

const MethodSelector = ({ selectedMethod, onMethodChange }) => {
    const methods = ['SAW', 'WP', 'TOPSIS', 'AHP'];

    return (
        <div className="mb-4">
            <label htmlFor="method-select" className="block text-sm font-medium text-gray-200 mb-2">
                Select Method:
            </label>
            <select
                id="method-select"
                value={selectedMethod}
                onChange={(e) => onMethodChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-700 text-white"
            >
                {methods.map((method) => (
                    <option key={method} value={method} className="bg-gray-700">
                        {method}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MethodSelector;