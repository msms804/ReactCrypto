import React, { useState } from 'react'

interface CarouselProps {
    markets: string[];
}

export const Slide: React.FC<CarouselProps> = ({ markets }) => {
    //이거 애니메이션으로 돌아가게 못하나?
    const [startIdx, setStartIdx] = useState(0);
    const [endIdx, setEndIdx] = useState(4);

    const showPrevSlides = () => {
        if (startIdx > 0) {
            setStartIdx(prev => prev - 1);
            setEndIdx(prev => prev - 1);
        }
    }
    const showNextSlides = () => {
        if (endIdx < markets.length - 1) {
            setStartIdx(prev => prev + 1);
            setEndIdx(prev => prev + 1);
        }
    }

    return (
        <div className='flex flex-row'>
            {(startIdx > 0) &&
                <button onClick={showPrevSlides} className='flex w-6 h-6 rounded-full border border-slate-200 justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                    </svg>
                </button>}
            {markets.slice(startIdx, endIdx + 1).map((item, i) => (
                <div key={i} className='w-1/5 border border-slate-200 rounded-lg h-50 p-6 mr-2'>
                    <div className='text-xs'>{item}</div>
                    <div className='font-medium'>17,173.12</div>
                    <div className='text-red-500 text-xs'>-0.08%</div>
                </div>
            ))}
            {(endIdx < markets.length - 1) &&
                <button onClick={showNextSlides} className='flex w-6 h-6 rounded-full border border-slate-200 justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>

                </button>}
        </div>
    )
}
