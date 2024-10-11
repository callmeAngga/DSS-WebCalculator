import React, { useState } from 'react';
import './styles/App.css'
import DSSCalculator from './components/DSSCalculator';
import ResultDisplay from './components/ResultDisplay';
import Conclusion from './components/Cunclusion';
import ChartVisualization from './components/ChartVisualization';
import Footer from './components/Footer';

export default function App() {
    const [result, setResult] = useState(null);

    const handleCalculationResult = (calculationResult) => {
        setResult(calculationResult);
    };

    return (
        <div className="min-h-screen bg-tertiary text-accent">

            <section className='object-contain w-full bg-primary'>
                <div className='container mx-auto'>
                    <div className='w-full h-36 flex items-center justify-center'>
                        <h1 className="text-3xl font-bold text-accent">Welcome to DSS Calculator</h1>
                    </div>
                </div>
            </section>

            {/* Section Input Start */}
            <section className='object-contain w-full'>
                <div className='container mx-auto'>
                    <div className='flex flex-col space-y-5'>
                        <div className='w-full flex'>
                            <div className='w-full h-full p-5'>
                                <DSSCalculator onCalculationResult={handleCalculationResult} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Section Input End */}

            {/* Section Output Start */}
            <section className='object-contain py-12 w-full bg-tertiary'>
                <div className='container mx-auto'>
                    <div className='flex flex-col justify-center items-center w-full'>
                        <h2 className="text-2xl font-bold mb-4 text-accent">Calculation Results</h2>
                        <ResultDisplay result={result} />
                    </div>
                    <div className='flex w-full justify-center items-center'>
                        {result && (
                            <div className="mt-8 w-full text-center">
                                <h2 className="text-xl font-bold text-accent mb-4 tracking-wider">CONCLUSION</h2>
                                <Conclusion result={result} />
                            </div>
                        )}
                        {result && (
                            <div className="mt-8 w-full text-center">
                                <h2 className="text-xl font-bold text-accent mb-4 tracking-wider">VISUALIZATION</h2>
                                <ChartVisualization result={result} />
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {/* Section Output End */}

            {/* Section Footer Start */}
            <section className='w-full bg-secondary object-contain py-3'>
                <div className='container mx-auto text-center'>
                    <Footer />
                </div>
            </section>
            {/* Section Footer End */}
        </div>
    );
}