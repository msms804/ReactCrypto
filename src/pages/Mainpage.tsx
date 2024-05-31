import CoinList from '../components/CoinList'
import { FearGreed } from '../components/FearGreed'
import { BtcDominance } from '../components/BtcDominance'
//일정비율 해야한다면 1:1:1비율로 하면될듯 col?
export const Mainpage = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <div className="container mx-auto px-16 lg:px-32 ">
                <div className="flex justify-between mt-10 space-x-4">
                    <div className="trending border border-slate-200 bg-white p-4 rounded-lg flex-1">
                        <h2 className="text-lg font-semibold mb-4">Bitcoin / TetherUS<span className='text-xs font-thin ml-2'>BTCUSDT</span></h2>
                        {/* Content for trending */}
                        <BtcDominance />
                    </div>
                    <div className="accounts border border-slate-200 bg-white p-4 rounded-lg flex-1">
                        <h2 className="text-lg font-semibold mb-4">Fear & Greed Index</h2>
                        {/* Content for accounts */}
                        <FearGreed />

                    </div>
                    <div className="fear-greed border border-slate-200 bg-white p-4 rounded-lg flex-1">
                        <h2 className="text-lg font-semibold mb-4">Fear & Greed Index</h2>
                        {/* Content for Fear & Greed Index */}
                        <h2 className='my-4'>시황(캐로셀)</h2>
                        <div className='flex flex-row'>
                            <div className='border border-slate-300 m-2 p-2'>나스닥</div>
                            <div className='border border-slate-300 m-2 p-2'>S&P 500</div>
                            <div className='border border-slate-300 m-2 p-2'>다우존스</div>
                            <div className='border border-slate-300 m-2 p-2'>테더</div>
                            <div className='border border-slate-300 m-2 p-2'>비트코인</div>
                            <div className='border border-slate-300 m-2 p-2'>이더리움</div>
                        </div>
                        시황? 김프? 김프차트? 몇개상승?하락?
                    </div>
                </div>

                {/** */}

                {/* <div className='flex flex-row'>
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
                </div> */}
                <div>
                    <h2 className='my-4'>코인리스트</h2>
                    <CoinList />
                </div>


            </div>
            <div className='container flex flex-col items-center flex-grow bg-white'>
                <footer className='bg-gray-200 w-full p-4 mt-auto'>footer
                    <div>made by minsung</div>
                </footer>
            </div>
        </div>
    )
}
