import React from 'react'
import { useParams } from 'react-router-dom'
import { CoinChart } from '../components/CoinChart';
/**
 * 
 * 1. 클릭하면 해당 라우트로 넘어가게?, 
 * 2. 클릭할때 props로 해당 코인 정보도 넘겨주기
 * 3. 그 상세페이지에서 useParams로 현재 
 */
export const CoinDetail = () => {
    const { id } = useParams();
    return (
        <div className='flex flex-col min-h-screen'>
            <div className='container mx-auto px-16 lg:px-32 mt-16 space-y-2'>
                <div className='text-xl '>비트코인 {id}</div>
                <div className='text-3xl font-medium'>82,645,000원</div>
                <div className='text-xs text-gray-500 font-semibold'>전일대비 0.74%</div>
                <div className='w-full h-96' ><CoinChart shortname={id} /></div>
            </div>
        </div>
    )
}
