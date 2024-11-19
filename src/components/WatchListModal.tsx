import { useEffect, useState } from 'react'
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
//import useUpbitWebsocket from '../hooks/useUpbitWebsocket';
import { IUpbit } from '../typings/db';

export const WatchListModal = () => {
    const [isHovered, setIsHovered] = useState(false);
    //const [watchList, setWatchList] = useState<string[]>([]);
    const watchlist = useSelector((state: RootState) => state.watchlist.items)
    const reduxUpbitCoins = useSelector((state: RootState) => state.upbit.coins)
    const [upbitWatched, setUpbitWatched] = useState<IUpbit[]>([]);
    // useUpbitWebsocket(); //이게 꼭 필요한가?

    useEffect(() => {
        // console.log("리덕스 테스트", reduxUpbitCoins)
        if (reduxUpbitCoins && watchlist) {
            //1. redux중 watchlist에 해당하는거만 추출
            //2. 이미지, 퍼센테이지, 가격을 upbitWatched에 저장
            //3. 렌더링
            // watchlist.filter(item => reduxUpbitCoins.includes(item))
            const newWatched = reduxUpbitCoins.filter(item => watchlist.includes(item.ticker))
            setUpbitWatched(newWatched);
        }
    }, [watchlist, reduxUpbitCoins])
    // useEffect(() => {
    //     // console.log(",,", upbitWatched)
    // }, [upbitWatched])
    const handleMouseEnter = () => {
        setIsHovered(true);
    }

    const handleMouseLeave = () => {
        setIsHovered(false);
    }
    //https://tailwindcss.com/docs/position 
    //position 공부할것
    const loadWatchList = () => {
        const watched = localStorage.getItem('watchlist')
        if (watched !== null) {
            console.log("모달창에서 가져옴", watched);
            console.log("모달창에서 가져옴2", JSON.parse(watched));
            //setWatchList(JSON.parse(watched))
        }

    }
    useEffect(() => {
        loadWatchList();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'watchlist') {
                // console.log()
                loadWatchList();
            }
        }
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        }
    }, [])
    //스크롤바 라이브러리: https://ehddud100677.tistory.com/369
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
                    className='absolute top-10 left-1/2 transform -translate-x-1/2 w-80 h-96 overflow-x-auto rounded-lg bg-white border-gray shadow-lg p-4'
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <h2 className='text-lg font-semibold mb-4'>관심종목</h2>
                    <table className='w-full'>
                        <thead>
                            <tr>
                                <th className='text-xs text-gray-500 text-left border-b border-y-gray-200 p-1'>코인명</th>
                                <th className='text-xs text-gray-500 text-right border-b border-y-gray-200 p-1'>가격</th>
                                <th className='text-xs text-gray-500 text-right border-b border-y-gray-200 p-1'>등락폭(24h)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upbitWatched.map(item =>
                                <tr key={item.ticker}>
                                    <td className='p-1'>
                                        <div className='flex flex-row items-center space-x-2'>
                                            <img src={item.image} className='w-5 h-5' />
                                            <div className='flex flex-col space-y-1'>
                                                <div className='text-xs font-medium'>{item.ticker.split('-')[1]} / {item.ticker.split('-')[0]}</div>
                                                <div className='text-xs text-gray-500'>{item.koreanname}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`text-right p-1 ${item.signed_change_rate >= 0 ? 'text-red-400' : 'text-blue-500'}`}>{item.trade_price}</td>
                                    <td className={`text-right p-1 ${item.signed_change_rate >= 0 ? 'text-red-400' : 'text-blue-500'}`}>{(item.signed_change_rate * 100).toFixed(2)}%</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            }
        </div>

    )
}
