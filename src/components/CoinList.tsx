import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { SevenDays } from "./SevenDays";
import useUpbitCoins from "../queries/upbitcoins";

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

const CoinList = () => {
    const [symbols, setSymbols] = useState<Market[]>([]);   //모든티커
    const [krwCoins, setKrwCoins] = useState<ticker[]>([]);//KRW- 로시작하는 코인
    const [usdtCoins, setUsdtCoins] = useState<ticker[]>([]);//USDT- 로시작하는 코인
    const [coins, setCoins] = useState<Market[]>([]);
    const [updatedCoins, setUpdatedCoins] = useState<ticker[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState("KRW");
    const { data: upbitcoins, error: upbitError, isLoading: upbitLoading } = useUpbitCoins();


    useEffect(() => {
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
        /**
            1. 쿼리로 가져온 데이터
            2. 먼저 이미지 매핑, hint: find함수
            3. 실시간 가격 매핑
        */
        if (upbitcoins) {
            console.log(upbitcoins[0])
        }

    }, [upbitcoins])

    const saveInDB = async (e: any) => {
        e.preventDefault();
        const imsi = usdtCoins.map((item) => ({
            ticker: item.market,
            shortname: item.market.split('-')[1],
            cryptoExchange: "upbit",
            englishname: item.english_name,
            koreanname: item.korean_name,
            theme: "",
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
    useEffect(() => {
        const fetchCoinData = async () => {
            const tickerResult = await axios.get('https://api.upbit.com/v1/ticker', {
                params: { markets: symbols.join(',') }
            })
            console.log("대굴빡", tickerResult.data);
            const updatedCoins = coins.map((coin, index) => ({
                ...coin,
                ...tickerResult.data[index]
            }))
            console.log("최종:", updatedCoins);
            setUpdatedCoins(updatedCoins);

        }
        fetchCoinData();
        //ㅇㅎ.. 지금갖고온데이터랑 위의 데이터 합쳐야..
        //어케해야할까..

    }, [symbols, coins])

    //여기서 필터링, 정렬?
    useEffect(() => {
        const krwCoin = updatedCoins.filter((item) => (
            item.market.startsWith("KRW-")
        ))
        const usdtCoin = updatedCoins.filter((item) => (
            item.market.startsWith("USDT-")
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
        setKrwCoins(krwCoin);
        setUsdtCoins(usdtCoin);

    }, [updatedCoins])


    useEffect(() => {
        console.log("분류작업", krwCoins);
        console.log("분류작업2", usdtCoins);
        console.log("모든티커", symbols)
    }, [krwCoins, usdtCoins, symbols])

    //코인게코에서 이미지 페칭
    // useEffect(() => {
    //     //이미지 가져와서 같은 shortname인것과 비교
    //     const fetchCoinImgs = async () => {
    //         try {
    //             const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    //                 params: {
    //                     vs_currency: 'krw',
    //                     order: 'market_cap_desc',
    //                     sparkline: false,
    //                 }
    //             });
    //             console.log("코인게코: ", response.data);

    //             const updatedKrwCoins = krwCoins.map(coin => {
    //                 const coinSymbol = coin.market.split('-')[1].toLowerCase(); // krwCoins의 symbol
    //                 const match = response.data.find((geckoCoin: any) => geckoCoin.symbol === coinSymbol);
    //                 if (match) {
    //                     return { ...coin, image: match.image };
    //                 }
    //                 return coin;
    //             });

    //             setKrwCoins(updatedKrwCoins);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     if (krwCoins.length > 0) {
    //         fetchCoinImgs();
    //     }
    // }, [krwCoins]);
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
                setUpdatedCoins(prev => prev.map(coin =>
                    (coin.market === receivedData.code) ? { ...coin, ...receivedData } : coin))
                //setBitTicker(receivedData.code);
                //setPrices(prevPrices => [...prevPrices, receivedData.trade_price]);
                //setPrices(receivedData.trade_price);
                //여기다 tickers에 티커네임만 매핑해야


            });
        }
        ws.onclose = () => {
            console.log("머임closed");
        }

        return () => {
            ws.close();
        }
    }, [symbols])
    // useEffect(() => {//3. 네임에 해당하는 가격들 매핑하고 렌더링
    //     if (prices !== undefined && bitTicker === markets[0]?.market) {
    //         const copyData = markets.map(coin => ({ ...coin, price: prices }));
    //         setMarkets(copyData);
    //     }
    // }, [bitTicker, markets[0]?.market, prices])

    /** 알고리즘
     * 1. market을 담을 수 있는 state 변수 만든다
     * 2. 소켓으로 가져온 데이터들의 티커에 해당하는 가격들을 붙인다?
     * 3. market에 이어붙이거나 
     * 굳이 ticker변수를..? --> 이렇게하면 map함수할때 번거롭지않나..
     * 
     * test
     * 1. 소켓으로 비트코인의 정보 가져온다 --> o
     * 2. if 소켓으로 가져온 비트의 티커가 markets의 티커와 같다면 --> o
     * 3. markets 객체에 삽입(가격정보를) 
     * 4. 삽입은 spread연산자로
     * 
     * -- 7days차트
     * 
     * 2. 가격 get요청으로 불러와서 맞는 티커?에 매핑?
     * 3. 7days 이렇게 차트만들수 있을듯 
     * 
     * --페이지네이션
     * 1. krw/ btc나눠서 state에 저장
     * 2. 10개씩 불러온다?
     * 3. 밑에 1 2 3 4 ... 이렇게 표시해야
     */
    if (upbitLoading) return <div>upbit loading...</div>
    return (<>
        <div className="container mx-auto mt-8">
            <div className="flex flex-row space-x-2 ">{/**왜 이렇게 밑에 넣어야함;;; */}
                <div className=" flex flex-row bg-slate-100 rounded-full p-1 space-x-2">
                    <div className={`rounded-full p-2  text-sm ${selectedCurrency === "KRW" ? 'bg-blue-500 text-white' : "bg-white"}`}
                        onClick={() => { setSelectedCurrency("KRW") }}>원화</div>
                    <div className={`rounded-full p-2 text-sm ${selectedCurrency === "USDT" ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        onClick={() => { setSelectedCurrency("USDT") }}>USDT</div>
                </div>
                <label className="">
                    <input type="search" placeholder="코인검색" className="border rounded-full p-1" />
                </label>
                {/* <div onClick={saveInDB}>코인 디비에저장</div> */}
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 bg-gray-100 border-b text-left"></th>
                        <th className="py-2 bg-gray-100 border-b text-left">#</th>
                        <th className="py-2 bg-gray-100 border-b text-left">코인명</th>
                        <th className="py-2 bg-gray-100 border-b text-left">가격</th>
                        <th className="py-2 bg-gray-100 border-b text-left">등락폭(24h)</th>

                        <th className="py-2 bg-gray-100 border-b text-left">거래대금(24h)</th>
                        <th className="py-2 bg-gray-100 border-b text-left">30D</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedCurrency === "KRW" ? krwCoins.slice(0, 10).map((item, index) => (
                        <tr key={index}>
                            <td>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                </svg>
                            </td>
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="flex flex-row items-center">
                                <span><img src="" className="w-8 h-8" /></span>
                                <span className="font-medium">{item.market.split('-')[1]}</span>
                                <span className="text-xs text-gray-500 ml-2">{item.korean_name}</span>
                            </td>
                            <td className={`${item.change === "RISE" ? "text-red-500" : "text-blue-600"} font-medium`}>{item.trade_price.toLocaleString('ko-KR')}</td>
                            <td className={`${item.change === "RISE" ? "text-red-500" : "text-blue-600"} font-medium`}>{(item.signed_change_rate * 100).toFixed(2)}%</td>
                            <td> {item.acc_trade_price_24h.toLocaleString('ko-KR')}</td>
                            <td><SevenDays ticker={item.market} change={item.change} /></td>

                        </tr>
                    )) : usdtCoins.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                </svg>
                            </td>
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td><span></span>{item.korean_name}</td>
                            <td>{item.trade_price.toLocaleString('ko-KR')}</td>
                            <td>{(item.signed_change_rate * 100).toFixed(2)}%</td>
                            <td> {item.acc_trade_price_24h.toLocaleString('ko-KR')}</td>
                            <td><SevenDays ticker={item.market} change={item.change} /></td>

                        </tr>
                    ))}

                </tbody>
            </table>

        </div>

    </>)
}
export default CoinList;