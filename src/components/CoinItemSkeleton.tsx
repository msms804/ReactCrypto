import React from 'react'

export const CoinItemSkeleton = () => {
    return (
        <tr className='animate-pulse'>
            {/* 와치리스트 아이콘 */}
            <td className='flex justify-center items-center'>
                <div className='w-4 h-6 bg-gray-200 rounded-md'></div>
            </td>

            {/* 인덱스 자리 */}
            <td className='py-2 px-4'>
                <div className='w-5 h-6 bg-gray-200 rounded-md'></div>
            </td>

            {/* 코인 정보 자리 */}
            <td className='flex flex-row items-center space-x-2'>
                <div className='w-40 h-6 bg-gray-200 rounded-md'></div>
            </td>

            {/* 가격 자리 */}
            <td>
                <div className='w-14 h-6 bg-gray-200 rounded-md'></div>
            </td>
            {/* 변동률 자리 */}
            <td>
                <div className='w-10 h-6 bg-gray-200 rounded-md'></div>
            </td>
            {/* 24시간 거래량 */}
            <td>
                <div className='w-24 h-6 bg-gray-200 rounded-md'></div>
            </td>

            {/* 7일 그래프 */}
            <td>
                <div className='w-16 h-6 bg-gray-200 rounded-md'></div>
            </td>
        </tr>
    )
}
