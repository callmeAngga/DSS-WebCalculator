import React from 'react';

const ResultDisplay = ({ result }) => {
    if (!result) {
        return <p>No calculation results yet. Please use the calculator above.</p>;
    }

    return (
        <div className=" w-full text-white">
            {result.steps.map((step, index) => (
                <div key={index} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <pre className="bg-gray-700 p-4 rounded-md overflow-x-auto">
                        {JSON.stringify(step.data, null, 2)}
                    </pre>
                </div>
            ))}
            <h3 className="text-xl font-semibold mb-2">Final Ranking</h3>
            <table className="min-w-full bg-gray-700">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Criteria</th>
                        <th className="px-4 py-2 border">Value</th>
                        <th className="px-4 py-2 border">Rank</th>
                    </tr>
                </thead>
                <tbody>
                    {result.result.map((item) => (
                        <tr className='text-center' key={item.index}>
                            <td className="px-4 py-2 border">C{item.index}</td>
                            <td className="px-4 py-2 border">{item.value.toFixed(4)}</td>
                            <td className="px-4 py-2 border">{item.rank}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultDisplay;