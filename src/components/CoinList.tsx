import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { SevenDays } from "./SevenDays";
import useUpbitCoins from "../queries/upbitcoins";
import { Search } from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, setUpbit, updateUpbitPrice } from "../store/store";
import useUpbitWebsocket from "../hooks/useUpbitWebsocket";
import { RootState } from '../store/store'
import { Cointable } from "./Cointable";
import { IUpbitThemes } from '../typings/db';
import { setWatchlist, addToWatchlist, removeFromWatchlist } from "../store/watchlistSlice";


interface Market {
    market: string;
    korean_name: string;
    english_name: string;
    price: number;
}
interface ticker {
    market: string;
    korean_name: string;
    english_name: string;
    price: number;
    change: string;
    signed_change_price: number;
    signed_change_rate: number;
    acc_trade_price_24h: number;
    trade_price: number;
    image: string,
}
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
const CoinList = () => {
    const [symbols, setSymbols] = useState<Market[]>([]);   //모든티커
    const [krwCoins, setKrwCoins] = useState<ticker[]>([]);//KRW- 로시작하는 코인
    const [usdtCoins, setUsdtCoins] = useState<ticker[]>([]);//USDT- 로시작하는 코인
    const [coins, setCoins] = useState<Market[]>([]);
    const [updatedCoins, setUpdatedCoins] = useState<ticker[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState("KRW");
    const { data: upbitcoins, error: upbitError, isLoading: upbitLoading } = useUpbitCoins();
    const [updatedUpbitCoins, setUpdatedUpbitCoins] = useState<upbit[]>([]);
    const [usdtUpbitCoins, setUsdtUpbitCoins] = useState<upbit[]>([])//updatedUpbitCoins중 usdt만 필터링한것
    const [krwUpbitCoins, setKrwUpbitCoins] = useState<upbit[]>([])//updatedUpbitCoins중 krw만 필터링한것
    //const dispatch = useDispatch();
    const reduxUpbitCoins = useSelector((state: RootState) => state.upbit.coins)
    const [reduxKrwCoins, setReduxKrwCoins] = useState<upbit[]>([]);
    const [reduxUsdtCoins, setReduxUsdtCoins] = useState<upbit[]>([])
    const [themes, setThemes] = useState<IUpbitThemes[]>();
    const [selectedTheme, setSelectedTheme] = useState<IUpbitThemes>({ theme: "ALL", name: "모든코인", description: "", coins: [] });
    const [selectedThemeCoins, setSelectedThemeCoins] = useState<string[]>();
    const [inputValue, setInputValue] = useState('');
    const [filteredKrwCoins, setFilteredKrwCoins] = useState<upbit[]>([]);
    const [searchedCoins, setSearchedCoins] = useState<upbit[]>([]);
    const [watchList, setWatchList] = useState<string[]>([]);
    const dispatch: AppDispatch = useDispatch();
    const watchlist = useSelector((state: RootState) => state.watchlist.items);
    useUpbitWebsocket();



    //krw, usdt 분류 / 거래대금순 정렬
    useEffect(() => {
        const reduxKRW = reduxUpbitCoins.filter((item) => item.ticker.includes("KRW"));
        const reduxUSDT = reduxUpbitCoins.filter((item) => item.ticker.includes("USDT"));
        reduxKRW.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
        reduxUSDT.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
        //console.log("리덕스 krw", reduxUSDT.length)
        setReduxKrwCoins(reduxKRW);
        setReduxUsdtCoins(reduxUSDT);
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

    /**
 * 1. 만약 rwa 눌렀음
 * 2. rwa에 들어있는 coins의 배열들 과
 * 3. reduxKrwCoins에 있는 coins들을 비교해야
 * 4. 그리고 filter
 */

    useEffect(() => {
        const fetchUpbitThemes = async () => {
            try {
                const result = await axios.get('http://localhost:8080/api/theme')
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

    const saveInDB = async (e: any) => {
        e.preventDefault();
        const imsi = updatedUpbitCoins.map((item) => ({
            ticker: item.ticker,
            shortname: item.shortname,
            cryptoExchange: item.cryptoExchange,
            englishname: item.englishname,
            koreanname: item.koreanname,
            theme: "",
            image: item.image || "",
        }))
        console.log("imsi", imsi);
        try {
            const response = await axios.post('http://localhost:8080/api/save/coin', imsi)
            console.log("코인저장성공", response.data)
        } catch (error) {
            console.error("코인저장실패", error);
        }
        // const promises = krwCoins.map((item) => {
        //     console.log(item.market, item.english_name, item.korean_name)
        //     axios.post('http://localhost:8080/api/save/coin', {
        //         ticker: item.market,
        //         shortname: item.market.split('-')[1],
        //         cryptoExchange: "upbit",
        //         englishname: item.english_name,
        //         koreanname: item.korean_name,
        //         theme: " ",
        //     })
        // })
        // try {
        //     const responses = await Promise.all(promises);
        //     console.log("프로미스테스트", responses);
        // } catch (error) {
        //     console.log("코인저장실패", error);
        // }
    }

    if (upbitLoading) return <div>upbit loading...</div>
    return (<>
        <div className="container mx-auto mt-8">

            <div className="flex flex-row justify-between">
                <div className="flex flex-row space-x-2 m-4">{/**왜 이렇게 밑에 넣어야함;;; */}
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
            <div className="overflow-y-auto h-[32rem]">
                <table className="min-w-full bg-white">
                    <thead >
                        <tr>
                            <th className="py-2  border-b text-left rounded-tl-lg"></th>
                            <th className="py-2  border-b text-left text-xs text-gray-500">#</th>
                            <th className="py-2  border-b text-left text-xs text-gray-500">코인명</th>
                            <th className="py-2 border-b text-left text-xs text-gray-500">가격</th>
                            <th className="py-2 border-b text-left text-xs text-gray-500">등락폭(24h)</th>

                            <th className="py-2  border-b text-left text-xs text-gray-500">거래대금(24h)</th>
                            <th className="py-2  border-b text-left rounded-tr-lg text-xs text-gray-500">가격(30Days)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedCurrency === "KRW" ?
                            filteredKrwCoins?.slice(0, 20).map((item, index) => (
                                <tr key={index}>
                                    <td onClick={() => { onClickWatched(item.ticker) }} className="flex justify-center items-center">
                                        {watchlist.includes(item.ticker)
                                            ? <svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" strokeWidth="1.5" stroke="orange" className="size-6 w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>
                                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gray" className="size-6 w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>
                                        }
                                    </td>
                                    <td className="py-2 px-4 text-sm text-left">{index + 1}</td>
                                    <td className="flex flex-row items-center space-x-2">
                                        <span><img src={item.image} className="w-7 h-7 rounded-full" /></span>
                                        <span className="font-medium">{item.shortname}</span>
                                        <span className="text-xs text-gray-500 ml-2">{item.koreanname}</span>

                                    </td>
                                    <td className={`${item.change === "RISE" ? "text-red-500" : "text-blue-600"} font-light`}>{item.trade_price?.toLocaleString('ko-KR')}</td>
                                    <td className={`${item.change === "RISE" ? "text-red-500" : "text-blue-600"} font-light`}>{(item.signed_change_rate * 100).toFixed(2)}%</td>
                                    <td className="font-light"> {item.acc_trade_price_24h?.toLocaleString('ko-KR')}</td>
                                    <td className="text-right"><SevenDays ticker={item.ticker} change={item.change} /></td>


                                </tr>
                            )) :
                            reduxUsdtCoins.slice(0, 20).map((item, index) => (
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

                    </tbody>
                </table>

            </div>
        </div>

    </>)
}
export default CoinList;