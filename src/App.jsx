import React, { useState } from 'react';
import './styles/App.css'
import DSSCalculator from './components/DSSCalculator';
import ResultDisplay from './components/ResultDisplay';

export default function App() {
    const [result, setResult] = useState(null);

    const handleCalculationResult = (calculationResult) => {
        setResult(calculationResult);
    };

    return (
        <div className="min-h-screen bg-black">

            {/* Section Input Start */}
            <section className='object-contain w-full bg-slate-700'>
                <div className='container mx-auto'>
                    <div className='flex flex-col space-y-5'>
                        <div className='w-full h-40 bg-slate-300 flex items-center justify-center'>
                            <h1 className="text-3xl font-bold text-gray-800">Welcome to DSS Calculator</h1>
                        </div>
                        <div className='w-full flex bg-slate-600'>
                            <div className='w-full h-full bg-slate-600 p-5'>
                                <DSSCalculator onCalculationResult={handleCalculationResult} />
                            </div>
                            <div className='w-96 h-full bg-slate-400 flex items-center justify-center p-4'>
                                {/* <p>Ini nanti bagian petunjuk singkat</p> */}
                                <div className="text-gray-800">
                                    <h2 className="text-xl font-bold mb-2">Quick Guide</h2>
                                    <ol className="list-decimal list-inside">
                                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas culpa, dicta maxime, laboriosam perferendis magni quam porro tenetur vitae fuga quia voluptatibus reiciendis placeat voluptates voluptatem eos est. Commodi, beatae.</li>
                                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas culpa, dicta maxime, laboriosam perferendis magni quam porro tenetur vitae fuga quia voluptatibus reiciendis placeat voluptates voluptatem eos est. Commodi, beatae.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Section Input End */}

            {/* Section Output Start */}
            <section className='text-white py-10 w-full'>
                <div className='container mx-auto'>
                    <div className='flex flex-col justify-center items-center w-full'>
                        <h2 className="text-2xl font-bold mb-4">Calculation Results</h2>
                        <ResultDisplay result={result} />
                    </div>
                </div>
            </section>
            {/* Section Output Start */}

            {/* Section Footer Start */}
            <section className=' w-full py-20 text-white'>
                <div className='container mx-auto'>
                    <div className='flex justify-center items-center'>
                        <p>INI NAMANYA FOOTER</p>
                    </div>
                </div>
            </section>
            {/* Section Footer End */}
        </div>
    );
}