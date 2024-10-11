import React from 'react';

const Conclusion = ({ result }) => {
    if (!result) {
        return "";
    }

    const finalRankingStep = result.steps.find(step => step.title === 'Final Ranking' || step.title === 'Final Ranking AHP');

    if (finalRankingStep && finalRankingStep.title === 'Final Ranking AHP') {
        const bestAlternative = Object.entries(finalRankingStep.data).reduce((best, [key, value]) => {
            return (!best || value.rank < best.rank) ? { key, ...value } : best;
        }, null);

        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-secondary rounded-lg shadow-lg text-accent">
                {bestAlternative ? (
                    <div className="text-center">
                        <p className="text-lg">
                            Alternatif terbaik adalah <strong className="text-primary">{bestAlternative.key}</strong> dengan nilai{' '}
                            <strong className="text-primary">{bestAlternative.weight.toFixed(4)}</strong>.
                        </p>
                        <p className="text-sm text-accent mt-2">Alternatif ini memiliki peringkat tertinggi.</p>
                    </div>
                ) : (
                    <p className="text-center text-red-400">Tidak ada data kesimpulan yang tersedia.</p>
                )}
            </div>
        );
    }

    const bestAlternative = finalRankingStep ? finalRankingStep.data.find(item => item.rank === 1) : null;
    
    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-secondary rounded-lg shadow-lg text-accent">
            {bestAlternative ? (
                <div className="text-center">
                    <p className="text-lg">
                        Alternatif terbaik adalah <strong className="text-primary">{`A${bestAlternative.index}`}</strong> dengan nilai{' '}
                        <strong className="text-primary">{bestAlternative.value.toFixed(4)}</strong>.
                    </p>
                    <p className="text-sm text-accent mt-2">Alternatif ini memiliki peringkat tertinggi.</p>
                </div>
            ) : (
                <p className="text-center text-red-400">Tidak ada data kesimpulan yang tersedia.</p>
            )}
        </div>
    );
};

export default Conclusion;