import React from 'react'
import CoinList from '../components/CoinList'
import { FearGreed } from '../components/FearGreed'
import HalvingCountdown from '../components/HalvingCountdown'
import { BtcDominance } from '../components/BtcDominance'
//일정비율 해야한다면 1:1:1비율로 하면될듯 col?
export const Mainpage = () => {
    return (
        <div className='flex flex-col min-h-screen bg-gray-200'>
            <div className='container flex flex-col items-center flex-grow bg-white'>
                <h2 className='my-4'>시황(캐로셀)</h2>
                <div className='flex flex-row'>
                    <div className='border border-slate-300 m-2 p-2'>나스닥</div>
                    <div className='border border-slate-300 m-2 p-2'>S&P 500</div>
                    <div className='border border-slate-300 m-2 p-2'>다우존스</div>
                    <div className='border border-slate-300 m-2 p-2'>테더</div>
                    <div className='border border-slate-300 m-2 p-2'>비트코인</div>
                    <div className='border border-slate-300 m-2 p-2'>이더리움</div>
                </div>
                <div className='flex flex-row'>
                    <div className='border border-slate-300 m-2 p-2 flex-grow'>
                        비트코인 도미넌스
                        <BtcDominance />
                    </div>
                    <div className='border border-slate-300 m-2 p-2 flex-grow'>
                        공포탐욕지수
                        <FearGreed />
                    </div>
                    <div className='border border-slate-300 m-2 p-2 flex-grow'>반감기 남은날수
                        <HalvingCountdown />
                        반감기 말고 다른거 생각해보자..
                        ~코인상승중 / ~코인하락중
                        <div> -- 근데 이거는 코인리스트위에해도..</div>
                    </div>
                </div>
                <div>
                    <h2 className='my-4'>코인리스트</h2>
                    <CoinList />
                </div>
                <footer className='bg-gray-200 w-full p-4 mt-auto'>footer</footer>
            </div>
        </div>
    )
}
