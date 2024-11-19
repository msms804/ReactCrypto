import React, { useEffect, useState } from "react";
import axios from "axios";
import useUpbitCoins from "../queries/upbitcoins";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/store";
import useUpbitWebsocket from "../hooks/useUpbitWebsocket";
import { RootState } from '../store/store'

import { IUpbitThemes } from '../typings/db';
import { setWatchlist, addToWatchlist, removeFromWatchlist } from "../store/watchlistSlice";
import { CoinItem } from "./CoinItem";
import { useVirtualizer } from "@tanstack/react-virtual";


interface upbit {
    koreanname: string,
    englishname: string,
    theme: string,
    ticker: string,
    shortname: string,
    image: string,
    cryptoExchange: string,
    trade_price: number,//가격
    acc_trade_price_24h: number,//거래대금
    signed_change_rate: number, //등락폭
    change: string,
}
interface ISortConfig {
    key: string | null;
    direction: 'ascending' | 'descending' | null;
}

const CoinList = () => {
    //const [symbols, setSymbols] = useState<Market[]>([]);   //모든티커
    //const [krwCoins, setKrwCoins] = useState<ticker[]>([]);//KRW- 로시작하는 코인
    //const [usdtCoins, setUsdtCoins] = useState<ticker[]>([]);//USDT- 로시작하는 코인
    //const [coins, setCoins] = useState<Market[]>([]);
    //const [updatedCoins, setUpdatedCoins] = useState<ticker[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState("KRW");
    //const { data: upbitcoins, error: upbitError, isLoading: upbitLoading } = useUpbitCoins();
    const { isLoading: upbitLoading } = useUpbitCoins();
    //const [updatedUpbitCoins, setUpdatedUpbitCoins] = useState<upbit[]>([]);
    // const [usdtUpbitCoins, setUsdtUpbitCoins] = useState<upbit[]>([])//updatedUpbitCoins중 usdt만 필터링한것
    // const [krwUpbitCoins, setKrwUpbitCoins] = useState<upbit[]>([])//updatedUpbitCoins중 krw만 필터링한것
    //const dispatch = useDispatch();
    const reduxUpbitCoins = useSelector((state: RootState) => state.upbit.coins)
    const [reduxKrwCoins, setReduxKrwCoins] = useState<upbit[]>([]);
    //const [reduxUsdtCoins, setReduxUsdtCoins] = useState<upbit[]>([])
    const [themes, setThemes] = useState<IUpbitThemes[]>();
    const [selectedTheme, setSelectedTheme] = useState<IUpbitThemes>({ theme: "ALL", name: "모든코인", description: "", coins: [] });
    const [selectedThemeCoins, setSelectedThemeCoins] = useState<string[]>();
    const [inputValue, setInputValue] = useState('');
    const [filteredKrwCoins, setFilteredKrwCoins] = useState<upbit[]>([]);
    const [searchedCoins, setSearchedCoins] = useState<upbit[]>([]);
    const [watchList] = useState<string[]>([]);
    const dispatch: AppDispatch = useDispatch();
    const watchlist = useSelector((state: RootState) => state.watchlist.items);
    const [sortConfig, setSortConfig] = useState<ISortConfig>({ key: null, direction: null });
    //const navigate = useNavigate();
    useUpbitWebsocket();



    //krw, usdt 분류 / 거래대금순 정렬
    useEffect(() => {
        const reduxKRW = reduxUpbitCoins.filter((item) => item.ticker.includes("KRW"));
        const reduxUSDT = reduxUpbitCoins.filter((item) => item.ticker.includes("USDT"));
        reduxKRW.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
        reduxUSDT.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
        //console.log("리덕스 krw", reduxUSDT.length)
        setReduxKrwCoins(reduxKRW);
        //setReduxUsdtCoins(reduxUSDT);
    }, [reduxUpbitCoins])


    //코인 검색기능
    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    }
    //검색필터링
    useEffect(() => {
        if (inputValue.trim() !== '') {
            const result = reduxKrwCoins.filter((item) => item.koreanname.includes(inputValue));
            setSearchedCoins(result);
        } else {
            setSearchedCoins(reduxKrwCoins);
        }
    }, [inputValue, reduxKrwCoins])



    useEffect(() => {
        const fetchUpbitThemes = async () => {
            try {
                const result = await axios.get('https://reactcrypto-server-production.up.railway.app/api/theme')
                console.log("테마리스트", result.data);
                setThemes(result.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUpbitThemes();
    }, [])

    const handleThemeChange = (theme: any) => {
        console.log("누른테마는?", theme)

        setSelectedTheme(theme);
        setSelectedThemeCoins(theme.coins)
        setInputValue("");//테마바꾸면 초기화

    }
    // const filteredKrwCoinList = (selectedTheme?.theme === 'ALL')
    //     ? reduxKrwCoins
    //     : reduxKrwCoins.filter((item) => selectedThemeCoins?.includes(item.ticker))
    // console.log("..", filteredKrwCoinList)//이거 계속찍히네
    // useEffect(() => {
    //     if (selectedTheme.theme === "ALL") {
    //         setFilteredKrwCoins(reduxKrwCoins);
    //     } else {
    //         const filteredCoins = reduxKrwCoins.filter((item: any) => selectedThemeCoins?.includes(item.ticker))
    //         setFilteredKrwCoins(filteredCoins)
    //     }
    // }, [selectedTheme, reduxKrwCoins])

    useEffect(() => {
        if (selectedTheme.theme === "ALL") {
            setFilteredKrwCoins(searchedCoins);
        } else {
            const filteredCoins = searchedCoins.filter((item: any) => selectedThemeCoins?.includes(item.ticker))
            setFilteredKrwCoins(filteredCoins)
        }
    }, [selectedTheme, searchedCoins])

    useEffect(() => {
        //1. 일단 로컬스토리지에서 watchlist 가져온다,getItem
        //2. 만약 없으면 setItem으로 빈배열 집어넣기
        const watched = localStorage.getItem('watchlist');
        if (watched) {
            // setWatchList(JSON.parse(watched));
            dispatch(setWatchlist(JSON.parse(watched)));
        } else {
            localStorage.setItem('watchlist', JSON.stringify([]));
        }
    }, [])
    const onClickWatched = (ticker: string) => {
        console.log('누른코인의 티커는?', ticker)
        // setWatchList((prev) => {
        //     if (!prev.some(item => item === ticker)) {
        //         const newList = [...prev, ticker];
        //         localStorage.setItem('watchlist', JSON.stringify(newList));
        //         return newList;
        //     } else {
        //         const newList = prev.filter(item => item !== ticker);
        //         localStorage.setItem('watchlist', JSON.stringify(newList))
        //         return newList
        //     }
        // })
        if (!watchlist.includes(ticker)) {//로컬스토리지, store에 추가
            dispatch(addToWatchlist(ticker))
            localStorage.setItem('watchlist', JSON.stringify([...watchlist, ticker]));
            console.log("디스패치 추가", ticker);
        } else {//로컬스토리지, store에 삭제
            dispatch(removeFromWatchlist(ticker))
            localStorage.setItem('watchlist', JSON.stringify(watchlist.filter(item => item !== ticker)));
            console.log("디스패치 삭제", ticker)
        }
    }
    useEffect(() => {
        console.log("와치리스트 state", watchList)
    }, [watchList])

    //코인저장함수
    // const saveInDB = async (e: any) => {
    //     e.preventDefault();
    //     const imsi = updatedUpbitCoins.map((item) => ({
    //         ticker: item.ticker,
    //         shortname: item.shortname,
    //         cryptoExchange: item.cryptoExchange,
    //         englishname: item.englishname,
    //         koreanname: item.koreanname,
    //         theme: "",
    //         image: item.image || "",
    //     }))
    //     console.log("imsi", imsi);
    //     try {
    //         const response = await axios.post('http://localhost:8080/api/save/coin', imsi)
    //         console.log("코인저장성공", response.data)
    //     } catch (error) {
    //         console.error("코인저장실패", error);
    //     }

    // }
    const handleSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        //만약 이미 ascending인 경우 --> descending
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        console.log('정렬테스트', key, direction)
        //sorting
        // const sortedCoins = [...reduxKrwCoins].sort((a: any, b: any) => {
        //     if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
        //         return direction === 'ascending' ? -1 : 1;
        //     }
        //     if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
        //         return direction === 'ascending' ? 1 : -1;
        //     }
        //     return 0;
        // })
        // setReduxKrwCoins(sortedCoins);
    }
    useEffect(() => {
        if (sortConfig.key) {
            const sortedCoins = [...filteredKrwCoins].sort((a, b) => {
                const aValue = a[sortConfig.key as keyof typeof a];
                const bValue = b[sortConfig.key as keyof typeof b];

                //문자열 비교
                if (typeof aValue === "string" && typeof bValue === "string") {
                    return sortConfig.direction === 'ascending'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue)
                } else { //숫자비교
                    if (aValue < bValue) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                }
                return 0;
                // if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
                //     return sortConfig.direction === 'ascending' ? -1 : 1;
                // }
                // if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
                //     return sortConfig.direction === 'ascending' ? 1 : -1;
                // }
                // return 0;
            });
            setFilteredKrwCoins(sortedCoins);
        }
    }, [sortConfig, filteredKrwCoins]);


    const parentRef = React.useRef<HTMLDivElement>(null)
    const virtualizer = useVirtualizer({
        count: filteredKrwCoins.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 52, //각 row의 높이
        overscan: 20,   //스크롤할 때 추가로 로드할 아이템 수
    })

    if (upbitLoading) return <div>upbit loading...</div>
    return (<>
        <div className="container mx-auto mt-8">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row space-x-2 m-4">
                    <div className=" flex flex-row space-x-2">
                        <div className={`border rounded-full px-2 py-1 text-xs ${selectedCurrency === "KRW" ? 'text-[#30d5c8] border-[#30d5c8]-400' : "text-gray-400 border-gray-400"}`}
                            onClick={() => { setSelectedCurrency("KRW") }}>원화</div>
                        <div className={`border rounded-full px-2 py-1 text-xs ${selectedCurrency === "USDT" ? 'text-[#30d5c8] border-[#30d5c8]-400' : "text-gray-500 border-gray-400"}`}
                            onClick={() => { setSelectedCurrency("USDT") }}>USDT</div>
                    </div>
                    <div className="border-l border-gray-400"></div>
                    <div className='flex flex-row space-x-2'>
                        {selectedCurrency === "KRW" && themes?.map((item) =>
                            <button
                                onClick={() => { handleThemeChange(item) }}
                                key={item.theme}
                                className={`px-2 py-1 text-xs border rounded-full ${selectedTheme?.theme === item.theme ? 'border-[#30d5c8]-400 text-[#30d5c8]' : 'border-slate-200 text-gray-500'}`}
                            >{item.name}</button>)}
                    </div>
                </div>
                <div className="relative">

                    <input type="search" placeholder="코인검색"
                        className="w-full text-sm pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={inputValue}
                        onChange={handleChangeValue}
                    />
                    <div className='absolute top-1/2 transform -translate-y-1/2  left-3 text-gray-500'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            className="w-5 h-5">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>

                    </div>

                </div>                {/* <button onClick={saveInDB}>코인 디비에저장</button> */}

            </div>
            {/* <Cointable data={filteredKrwCoins} /> */}

            <div ref={parentRef} className="relative overflow-y-auto h-[32rem]">
                <table className="min-w-full bg-white table-fixed">
                    <thead >
                        <tr>
                            <th className="py-2  border-b text-left rounded-tl-lg"></th>
                            <th className="py-2 px-4 border-b text-left text-xs text-gray-500">
                                #
                            </th>
                            <th className="py-2  border-b text-left text-xs text-gray-500">
                                <div className="flex items-center" onClick={() => { handleSort('shortname') }}>
                                    <div>코인명</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                        <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </th>
                            <th className="py-2 border-b text-left text-xs text-gray-500 ">
                                <div className="flex items-center" onClick={() => { handleSort('trade_price') }}>
                                    <div>가격</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                        <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </th>
                            <th className="py-2 border-b text-left text-xs text-gray-500">
                                <div className="flex items-center" onClick={() => { handleSort('signed_change_rate') }}>
                                    <div>등락폭(24h)</div>
                                    {(sortConfig.key === 'signed_change_rate' && sortConfig.direction === 'ascending') ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                        <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                            <path fillRule="evenodd" d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                </div>

                            </th>

                            <th className="py-2  border-b text-left text-xs text-gray-500 ">
                                <div className="flex items-center" onClick={() => { handleSort('acc_trade_price_24h') }}>
                                    <div>거래대금(24h)</div>
                                    {(sortConfig.key === 'acc_trade_price_24h' && sortConfig.direction === 'ascending') ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                        <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                            <path fillRule="evenodd" d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                                        </svg>

                                    }
                                </div>
                            </th>
                            <th className="py-2  border-b text-left rounded-tr-lg text-xs text-gray-500">가격(30Days)</th>
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {virtualizer.getVirtualItems().map((virtualRow, index) => {
                            const item = filteredKrwCoins[virtualRow.index];//가상화된 행에 맞는 데이터 가져옴

                            return (
                                <CoinItem
                                    key={item.ticker}
                                    onClickWatched={() => onClickWatched(item.ticker)}
                                    item={item}
                                    index={virtualRow.index}
                                    watchlist={watchlist}
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                                        // transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                />
                            )
                        })}
                    </tbody>
                    {/* <tbody>
                        {selectedCurrency === "KRW" ?
                            filteredKrwCoins?.map((item, index) => (
                                <CoinItem
                                    onClickWatched={() => onClickWatched(item.ticker)}
                                    item={item}
                                    index={index}
                                    watchlist={watchlist}
                                />
                            ))

                            : reduxUsdtCoins.slice(0, 20).map((item, index) => (
                                <tr key={index}>
                                    <td onClick={() => { onClickWatched(item.ticker) }}>
                                        {watchlist.includes(item.ticker)
                                            ? <svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" strokeWidth="1.5" stroke="orange" className="size-6 w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>
                                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gray" className="size-6 w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>
                                        }
                                    </td>
                                    <td className="py-2 px-4">{index + 1}</td>
                                    <td className="flex flex-row items-center space-x-2">
                                        <span><img src={item.image} className="w-7 h-7 rounded-full" /></span>
                                        <span className="font-medium">{item.shortname}</span>
                                        <span className="text-xs text-gray-500 ml-2">{item.koreanname}</span>
                                    </td>
                                    <td className={`${item.change === "RISE" ? "text-red-500" : "text-blue-600"} font-light`}> {item.trade_price.toLocaleString('ko-KR')}</td>
                                    <td className={`${item.change === "RISE" ? "text-red-500" : "text-blue-600"} font-light`}>{(item.signed_change_rate * 100).toFixed(2)}%</td>
                                    <td className="font-light"> {item.acc_trade_price_24h.toLocaleString('ko-KR')}</td>
                                    <td className="text-right"><SevenDays ticker={item.ticker} change={item.change} /></td>

                                </tr>
                            ))
                        }

                    </tbody> */}
                </table>

            </div>
        </div>

    </>)
}
export default CoinList;