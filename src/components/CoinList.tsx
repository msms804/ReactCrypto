import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { SevenDays } from "./SevenDays";
import useUpbitCoins from "../queries/upbitcoins";
import { Search } from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { setUpbit, updateUpbitPrice } from "../store/store";
import useUpbitWebsocket from "../hooks/useUpbitWebsocket";
import { RootState } from '../store/store'
import { Cointable } from "./Cointable";
import { IUpbitThemes } from '../typings/db';


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
    const dispatch = useDispatch();
    const reduxUpbitCoins = useSelector((state: RootState) => state.upbit.coins)
    const [reduxKrwCoins, setReduxKrwCoins] = useState<upbit[]>([]);
    const [reduxUsdtCoins, setReduxUsdtCoins] = useState<upbit[]>([])
    const [themes, setThemes] = useState<IUpbitThemes[]>();
    const [selectedTheme, setSelectedTheme] = useState<IUpbitThemes>({ theme: "ALL", name: "모든코인", description: "", coins: [] });
    const [selectedThemeCoins, setSelectedThemeCoins] = useState<string[]>();
    const [inputValue, setInputValue] = useState('');

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
        // setInputValue(value);
        // const result = filteredKrwCoinList.filter((item) => item.koreanname.includes(value));
        // setReduxKrwCoins(result);
    }
    //테마별 코인 필터링 코드
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
    }
    const filteredKrwCoinList = (selectedTheme?.theme === 'ALL')
        ? reduxKrwCoins
        : reduxKrwCoins.filter((item) => selectedThemeCoins?.includes(item.ticker))
    console.log("후.. 힘드노..", filteredKrwCoinList)//이거 계속찍히네


    /**
     * 
     * useEffect(() => {
        const fetchMarketData = async () => {//마켓 분류 코드 (krw / usd)
            try {
                const result = await axios.get("https://api.upbit.com/v1/market/all?isDetails=false");
                const newSymbols = result.data.map((item: any) => item.market);
                // const krwMarket = result.data.filter((item: any) => item.market.startsWith('KRW-'))
                // const usdtMarket = result.data.filter((item: any) => item.market.startsWith('USDT-'))
                //setKrwCoins(krwMarket);
                //setUsdtCoins(usdtMarket);
                setCoins(result.data);
                setSymbols(newSymbols);


            } catch (error) {
                console.log(error);
            }
        }
        fetchMarketData();
    }, [])

    useEffect(() => {
        const fetchGeckoImgs = async () => {
            if (upbitcoins) {
                try {
                    // const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {//왜 100개밖에
                    //     params: {
                    //         vs_currency: 'usd',
                    //         order: 'market_cap_desc',
                    //         sparkline: false,
                    //     }
                    // });
                    // console.log("코인게코에서 가져온데이터:", response.data);
                    // const newUpbitCoins = upbitcoins.map((upbitdata: any) => {
                    //     const match = response.data.find((geckocoin: any) => (geckocoin.symbol === upbitdata.shortname.toLowerCase()))
                    //     if (match) {
                    //         return { ...upbitdata, image: match.image }
                    //     }
                    //     return upbitdata
                    // })
                    // console.log("코인게코 업비트에 매핑", newUpbitCoins)
                    // setUpdatedUpbitCoins(newUpbitCoins);
                    setUpdatedUpbitCoins(upbitcoins)
                    //리덕스에 저장
                    //dispatch(setUpbit(upbitcoins))

                } catch (error) {
                    console.error(error);
                }

            }
        }
        fetchGeckoImgs();
    }, [upbitcoins, dispatch])
*/
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
    /**
    *     useEffect(() => {
        const fetchCoinData = async () => {
            const tickerResult = await axios.get('https://api.upbit.com/v1/ticker', {
                params: { markets: symbols.join(',') }
            })
            console.log(tickerResult.data);
            const updatedCoins = coins.map((coin, index) => ({
                ...coin,
                ...tickerResult.data[index]
            }))
            console.log("최종:", updatedCoins);
            setUpdatedCoins(updatedCoins);

        }
        fetchCoinData();

    }, [symbols, coins])

    //여기서 필터링, 정렬?
    useEffect(() => {
        const krwCoin = updatedCoins.filter((item) => (
            item.market.startsWith("KRW-")
        ))
        const usdtCoin = updatedCoins.filter((item) => (
            item.market.startsWith("USDT-")
        ))
        const krwUpbit = updatedUpbitCoins.filter((item) => (
            item.ticker.startsWith("KRW-")
        ))
        const usdtUpbit = updatedUpbitCoins.filter((item) => (
            item.ticker.startsWith("USDT-")
        ))

        krwCoin.sort((a, b) => {
            if (a.acc_trade_price_24h < b.acc_trade_price_24h) {
                return 1;
            }
            if (a.acc_trade_price_24h > b.acc_trade_price_24h) {
                return -1;
            }
            return 0;
        })
        krwUpbit.sort((a, b) => {
            if (a.acc_trade_price_24h < b.acc_trade_price_24h) {
                return 1;
            }
            if (a.acc_trade_price_24h > b.acc_trade_price_24h) {
                return -1;
            }
            return 0;
        })
        usdtUpbit.sort((a, b) => {
            if (a.acc_trade_price_24h < b.acc_trade_price_24h) {
                return 1;
            }
            if (a.acc_trade_price_24h > b.acc_trade_price_24h) {
                return -1;
            }
            return 0;
        })

        setKrwCoins(krwCoin);
        setUsdtCoins(usdtCoin);
        setKrwUpbitCoins(krwUpbit);
        setUsdtUpbitCoins(usdtUpbit);

    }, [updatedCoins, updatedUpbitCoins])


    useEffect(() => {
        console.log("분류작업", krwCoins);
        console.log("분류작업2", usdtCoins);
        console.log("모든티커", symbols)
    }, [krwCoins, usdtCoins, symbols])

    useEffect(() => {
        const ws = new WebSocket("wss://api.upbit.com/websocket/v1");

        ws.onopen = () => {
            console.log("connected");
            ws.send(JSON.stringify([
                { "ticket": uuidv4() },
                //1. 여기서 "codes"에 보내는거 markets의 모든 market로 매핑?해서 보내야
                { "type": "ticker", "codes": symbols },
                //{ "type": "ticker", "codes": allPrices },//allPrices를 deps에 넣어야..??
                { "format": "DEFAULT" },
            ]));
        }
        ws.onerror = (err) => {
            console.error("WebSocket error: ", err);
        }
        ws.onmessage = (event) => {
            // const receivedData = JSON.parse(event.data);
            // console.log(receivedData);
            event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
                const decoder = new TextDecoder('utf-8');
                const text = decoder.decode(buffer);
                const receivedData = JSON.parse(text);
                console.log("받은데이터", receivedData)
                //여기서 매핑해야
                if (receivedData) {
                    dispatch(updateUpbitPrice({
                        upbitticker: receivedData.code,
                        upbitTradePrice: receivedData.trade_price,
                        upbitacc: receivedData.acc_trade_price_24h,
                        upbitchangerate: receivedData.signed_change_rate,
                        upbitchange: receivedData.change,
                    }))
                }

                setUpdatedCoins(prev => prev.map(coin =>
                    (coin.market === receivedData.code) ? { ...coin, ...receivedData } : coin))
                //setBitTicker(receivedData.code);
                //setPrices(prevPrices => [...prevPrices, receivedData.trade_price]);
                //setPrices(receivedData.trade_price);
                //여기다 tickers에 티커네임만 매핑해야
                setUpdatedUpbitCoins(prev => prev.map(coin => (coin.ticker === receivedData.code)
                    ? {
                        ...coin,
                        trade_price: receivedData.trade_price,//가격
                        acc_trade_price_24h: receivedData.acc_trade_price_24h,//거래대금
                        signed_change_rate: receivedData.signed_change_rate, //등락폭
                        change: receivedData.change,    //상승, 보합, 하락
                    } : coin))
            });
        }
        ws.onclose = () => {
            console.log("머임closed");
        }

        return () => {
            ws.close();
        }
    }, [symbols])

 */
    if (upbitLoading) return <div>upbit loading...</div>
    return (<>
        <div className="container mx-auto mt-8">
            <div className="flex flex-row space-x-2 justify-between m-4">{/**왜 이렇게 밑에 넣어야함;;; */}
                <div className=" flex flex-row bg-slate-100 rounded-full p-1 space-x-2">
                    <div className={`rounded-full p-2  text-sm ${selectedCurrency === "KRW" ? 'bg-blue-500 text-white' : "bg-white"}`}
                        onClick={() => { setSelectedCurrency("KRW") }}>원화</div>
                    <div className={`rounded-full p-2 text-sm ${selectedCurrency === "USDT" ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        onClick={() => { setSelectedCurrency("USDT") }}>USDT</div>
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
            <div>
                <div className='flex flex-row space-x-2 m-4'>

                    {themes?.map((item) =>
                        <button
                            onClick={() => { handleThemeChange(item) }}
                            key={item.theme}
                            className={`p-1 text-xs text-slate-500 border-b border-slate-200 ${selectedTheme?.theme === item.theme ? 'bg-slate-200' : ''}`}
                        >{item.name}</button>)}
                </div>
                {/* <Cointable /> */}
            </div>
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
                        filteredKrwCoinList.slice(0, 10).map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
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
                        reduxUsdtCoins.slice(0, 10).map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
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

    </>)
}
export default CoinList;