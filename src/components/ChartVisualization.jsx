import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { color } from 'chart.js/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartVisualization = ({ result }) => {
    let labels, values;

    if (!result || !result.steps) {
        return <p className="text-accent">No data available to visualize.</p>;
    }

    const finalRankingStep = result.steps.find(step => step.title === 'Final Ranking' || step.title === 'Final Ranking AHP');

    if (!finalRankingStep) {
        return <p className="text-accent">No ranking data available.</p>;
    }

    if (Array.isArray(finalRankingStep.data)) {
        // For non-AHP methods
        labels = finalRankingStep.data.map(item => `A${item.index}`);
        values = finalRankingStep.data.map(item => item.value);
    } else if (typeof finalRankingStep.data === 'object') {
        // For AHP method
        labels = Object.keys(finalRankingStep.data);
        values = Object.values(finalRankingStep.data).map(item => item.weight);
    } else {
        return <p className="text-accent">Unexpected data structure in final ranking step.</p>;
    }

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Ranking Values',
                color: '#D6BD98',
                data: values,
                backgroundColor: '#D6BD98',
                borderColor: '#1A3636',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ranking Alternatif',
                color: '#D6BD98', 
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#677D6A',
                },
                ticks: {
                    color: '#D6BD98',
                },
            },
            x: {
                grid: {
                    color: '#677D6A', 
                },
                ticks: {
                    color: '#D6BD98',
                },
            },
        },
    };

    return (
        <div className="max-w-lg mx-auto mt-8 p-4 bg-secondary rounded-lg shadow-lg">
            <Bar className='w-full' data={chartData} options={chartOptions} />
        </div>
    );
};

export default ChartVisualization;