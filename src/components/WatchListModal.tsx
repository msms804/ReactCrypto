import React, { useState } from 'react'

export const WatchListModal = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    }

    const handleMouseLeave = () => {
        setIsHovered(false);
    }

    return (
        <div className='relative'>
            <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                WatchList
            </button>
            {
                isHovered
                && <div
                    className='absolute top-10 left-0 w-64 bg-white border-gray shadow-lg rounded p-4'
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <ul>
                        <li>BTC     $60,852.56      -1.58% </li>
                        <li>ETH     $60,852.56      -2.08% </li>
                        <li>SOL     $60,852.56      -3.92% </li>
                    </ul>
                </div>
            }
        </div>

    )
}
