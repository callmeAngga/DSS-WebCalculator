import React from 'react';

const MethodSelector = ({ selectedMethod, onMethodChange }) => {
    const methods = ['SAW', 'WP', 'TOPSIS', 'AHP'];

    const disabledOption = (
        <option key="-1" value="" disabled>
            CHOOSE ONE
        </option>
    );

    return (
        <div className="mb-4">
            <label htmlFor="method-select" className="block text-sm font-medium text-accent mb-2">
                Select Method:
            </label>
            <select
                id="method-select"
                value={selectedMethod}
                onChange={(e) => onMethodChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-secondary text-accent"
            >
                {disabledOption}
                {methods.map((method) => (
                    <option key={method} value={method}>
                        {method}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MethodSelector;