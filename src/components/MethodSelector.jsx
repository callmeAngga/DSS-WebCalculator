import React from 'react';

const MethodSelector = ({ selectedMethod, onMethodChange }) => {
  const methods = ['SAW', 'WP', 'TOPSIS', 'AHP'];

  return (
    <div className="mb-4">
      <label htmlFor="method-select" className="block text-sm font-medium text-black">Select Method:</label>
      <select
        id="method-select"
        value={selectedMethod}
        onChange={(e) => onMethodChange(e.target.value)}
        className="mt-1 text-gray-400 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 focus:outline-none sm:text-sm"
      >
        {methods.map((method) => (
          <option key={method} value={method}>{method}</option>
        ))}
      </select>
    </div>
  );
};

export default MethodSelector;