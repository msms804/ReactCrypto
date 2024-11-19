import { useEffect, useState } from "react"
import useUpbitCoins from "../queries/upbitcoins";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import useUpbitWebsocket from "../hooks/useUpbitWebsocket";
import axios from "axios";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";



interface kimchi {
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
    binance_trade_price: number,
}

const saveRateInDB = async (rate: any) => {//디비에 저장하는 로직
    console.log(rate);
    await axios.post('https://reactcrypto-server-production.up.railway.app/api/save/rates', { baseprice: rate.baseprice, date: rate.date })
}
const fetchRateFromDB = async () => {//디비에서 가져오는 로직
    const result = await axios.get('https://reactcrypto-server-production.up.railway.app/api/rates');
    console.log("디비에서 꺼낸 환율", result.data);
    return result.data;
}

export const KimchiPremium = () => {
    const [coinExchange] = useState([{
        koreanname: "업비트",
        englishname: "upbit",
        image: "https://asset.coinness.com/exchange/logo/7dcea0013b4ec6942b703c52967c159b.png?f=webp&w=64&h=64"
    },
    {
        koreanname: "빗썸",
        englishname: "bitthumb",
        image: "https://asset.coinness.com/exchange-logo/6e6958559dd757d470dffe37cabe44a9.png?f=webp&w=64&h=64"
    }])
    const [open, setOpen] = useState(false);
    const { data: upbitcoins, isLoading: upbitLoading } = useUpbitCoins();
    const [upbitshortname, setUpbitShortName] = useState([]);//바이낸스에 보낼 티커 배열
    //const [upbitBinance, setUpbitBinance] = useState<upbitBinance[]>([])
    //업비트 바이낸스 가격차 퍼센트 다 떼려넣을 변수, 이거 렌더링할거임
    const [kimchi, setKimchi] = useState<kimchi[]>([]);
    const reduxItems = useSelector((state: RootState) => state.upbit.coins)
    const [exchangeRate] = useState();
    const queryClient = useQueryClient();
    const [rate, setRate] = useState();
    const { data: exchangeRateData, isLoading: exchangeRateIsLoading } = useQuery({
        queryKey: ['exchangeRate'],
        queryFn: fetchRateFromDB,
    });

    useUpbitWebsocket();
    //두나무의 환율 api 가져오기
    // const fetchExchangeRate = async () => {
    //     const result = await axios.get('https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD')
    //     //이거 서버에서 요청하게 바꿔버리자 ,,
    //     console.log("", result.data);
    //     console.log("", result.data[0].basePrice)
    //     setExchangeRate(result.data[0].basePrice)
    //     //axios.post('')
    //     return { basePrice: result.data[0].basePrice, date: result.data[0].date };
    // }
    const fetchImsi = async () => {
        try {
            const rate = await axios.get(`https://v6.exchangerate-api.com/v6/d1a33935a34a3bab03dd52ce/latest/USD`)
            const today = dayjs().format('YYYY-MM-DD');
            console.log("exchangerate api에서 가져옴", rate.data.conversion_rates.KRW, today);
            return { basePrice: rate.data.conversion_rates.KRW, date: today };
        } catch (error) {
            console.log("exchangerate api 에서 에러", error);
        }
    }
    useEffect(() => {
        //fetchRateFromDB();
        /**
         * 1. 디비에서 최근 환율, 날짜 가져오는로직 fetchRateFromDB (useQuery 사용?)
         * 2. 가져온 날짜가 오늘이라면( 아마 dayjs 활용하면 될듯 )
         * 3. 그대로  쓴다
         * 4. 가져온 날자가 지난날이면
         * 5. 디비에 새로저장
         * 6. 다시 디비에서 가져온다.
         */
        const fetchAndSaveRate = async () => {
            // fetchRateFromDB();
            // fetchExchangeRate().then(apiRate => {//비동기 어쩌고
            //     console.log("으 머리야", apiRate.basePrice, apiRate.date);
            // });
            const latestRate = await fetchRateFromDB();
            console.log("훔훔1", latestRate[0]);
            console.log("훔훔3", dayjs(latestRate[0].date))

            //여기서 하면 되나;; --> 이게 아니라 리액트쿼리로 가져온거 써야지 .. ;;
            setRate(latestRate[0].baseprice)

            const lastUpdated = latestRate[0]?.date ? dayjs(latestRate[0].date) : null;
            console.log("훔훔2", lastUpdated);
            const now = dayjs();

            //생각해보니까 이거 주말엔 없던데..ㅔ;;
            //환율의 생성? 날짜 말고 나한테 보낸날짜를 저장하면 될거같기도..
            if (!lastUpdated || now.diff(lastUpdated, 'day') >= 1) {
                console.log(" 이거하루에 한번만 나와야됨")
                const rate = await fetchImsi();
                console.log("", rate);
                console.log("api에서 받은 환율, 날짜", rate?.basePrice, rate?.date)
                await saveRateInDB({ baseprice: rate?.basePrice, date: rate?.date });
                queryClient.invalidateQueries({ queryKey: ['exchangeRate'] });
                //여기서 또 하면될듯..
                //setRate()
            }
        }
        fetchAndSaveRate();
    }, [queryClient])

    useEffect(() => {
        console.log("리액트 쿼리로 받은 환율", exchangeRateData);
        console.log("", rate)
    }, [exchangeRateData, rate])

    /**
     * 1. 디비에서 최근 환율 가져오기 get rate
     * 2. 만약 최근환율이 오늘게 아니라면 rate !== today
     * 3. 두나무 환율 api에서 가져와서 디비에 저장 post rate
     * 4. 다시 최근환율 가져오기 get rate
     * 
     * 필요한것 : 
     * 1. server에 저장할때 오늘의 환율과 오늘의 날짜 저장
     * 2. 이거 디비에 저장하는 코드
     * 3. 이거 디비에서 꺼내오는코드
     */
    useEffect(() => {
        if (upbitcoins) {
            console.log("리덕스테스트", reduxItems);
            //krw만 필터링
            const newReduxItems = reduxItems.filter((item: any) => item.ticker.startsWith("KRW-"))
            //거래대금순 정렬
            newReduxItems.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h);

            // const kimchiItems = newReduxItems.map((item: any) => ({
            //     ...item,
            //     binance_trade_price: 0,
            // }))

            // 기존 kimchi 상태와 병합하여 binance_trade_price를 유지
            const updatedKimchi = newReduxItems.map((newItem: any) => {
                const existingItem = kimchi.find((oldItem) => oldItem.ticker === newItem.ticker);
                // return {
                //     ...newItem,
                //     binance_trade_price: (existingItem?.binance_trade_price !== 0)
                //      ? existingItem.binance_trade_price : 0
                // };
                return {
                    ...newItem,
                    binance_trade_price: (existingItem?.binance_trade_price !== 0)
                        ? existingItem?.binance_trade_price : 0
                };
            });
            setKimchi(updatedKimchi)


            //console.log("캐싱", upbitcoins);
            //upbitcoins.shortname += usdt@trade

            //const upbitdata = upbitcoins.map((item: any) => item.shortname.toLowerCase() + "usdt@trade")
            const upbitKrwData = upbitcoins.filter((item: any) => (
                item.ticker.startsWith("KRW-")
            ))
            const upbitKrwShortname = upbitKrwData.map((item: any) => item.shortname.toLowerCase() + "usdt@trade")
            console.log(upbitKrwShortname.length);
            setUpbitShortName(upbitKrwShortname);   //이거 krw만 보내도록 바꿔야

            //setUpbitBinance(upbitKrwData);



        }
    }, [upbitcoins, reduxItems])
    // 미국 달러(USD)를 대한민국 원(KRW)으로 변환할 때의 환율 정보를 가져오는 함수


    useEffect(() => {
        // const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr')
        // //const ws = new WebSocket('wss://ws-api.binance.com:443/ws-api/v3');
        // ws.onmessage = (event) => {
        //     const data = JSON.parse(event.data);
        //     console.log(data)
        //     //setBtcPrice(data.p);
        // }
        // return () => {
        //     ws.close();
        // }
        const ws = new WebSocket('wss://stream.binance.com:9443/ws');
        //let isSubscribed = true;

        ws.onopen = () => {
            console.log("WebSocket connection established.");

            // 구독 요청 메시지 보내기
            const subscribeMessage = {
                method: "SUBSCRIBE",
                // params: [
                //     "btcusdt@trade",
                //     "ethusdt@trade",
                //     "solusdt@trade"
                // ],
                params: upbitshortname,
                id: 1
            };

            ws.send(JSON.stringify(subscribeMessage));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("", data.s)

            // data.s가 존재하고, USDT를 포함하는지 확인
            if (exchangeRateData && data.s && data.s.includes("USDT")) {
                const symbol = data.s.split("USDT")[0];
                console.log("바이낸스", symbol, "가격: ", data.p);
                // setUpbitBinance(prev => prev.map((item: any) =>
                //     (item.shortname === symbol)
                //         ? {
                //             ...item,
                //             trade_price: data.p
                //         } : item
                // ))




                setKimchi(prev => prev.map((item: any) =>
                    (item.shortname === symbol) ? {
                        ...item,
                        binance_trade_price: data.p * exchangeRateData[0].baseprice,
                    } :
                        item
                ))
                // 바이낸스 가격을 대한민국 원으로 변환하여 binance_trade_price에 저장하는 코드
                // setKimchi(prev => prev.map((item: any) => {
                //     if (item.shortname === symbol) {
                //         // data.p를 대한민국 원으로 변환하여 binance_trade_price에 저장
                //         convertToKRW(data.p).then(krwAmount => {
                //             return {
                //                 ...item,
                //                 binance_trade_price: krwAmount
                //             };
                //         }).catch(error => {
                //             console.error('Error converting to KRW:', error);
                //             return item; // 변환 실패 시 기존 값 반환
                //         });
                //     } else {
                //         return item; // shortname이 일치하지 않을 때 기존 값 반환
                //     }
                // }));
                // 비동기 작업을 수행한 후 Promise 배열을 반환


            }

        };

        ws.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        return () => {
            //isSubscribed = false;
            ws.close();
        };
    }, [upbitshortname, exchangeRate])//upbitBinance도 deps에 넣으니까 소켓오류남
    const onClickCoinExchange = () => {
        setOpen(prev => !prev);
    }
    //아.. 비교할땐 업비트의 usdt랑 비교해야겠네.. 아님 krw 변환해도될지도..
    if (upbitLoading) return <div>로딩중</div>
    if (exchangeRateIsLoading) return <div>환율 로딩중</div>

    return (
        <div className="container mx-auto px-64 mt-16">
            <div className="font-semibold text-2xl">
                김치 프리미엄
            </div>
            <div className="flex flex-row space-x-6 mt-12 justify-center ">
                <div className="flex flex-col">
                    <button className="flex flex-row space-x-3 rounded-full border border-1 p-1" onClick={onClickCoinExchange}>
                        <img
                            className="w-6 h-6"
                            src="https://asset.coinness.com/exchange/logo/7dcea0013b4ec6942b703c52967c159b.png?f=webp&w=64&h=64" />
                        <h1>업비트</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {open && <div>
                        <ul>
                            <li className="flex flex-row"><img className="w-4 h-4" src={coinExchange[0].image} />{coinExchange[0].koreanname}</li>
                            <li className="flex flex-row"><img className="w-4 h-4" src={coinExchange[1].image} /> {coinExchange[1].koreanname}</li>
                        </ul>
                    </div>}
                </div>
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M10.47 2.22a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H5.75a.75.75 0 0 1 0-1.5h5.69l-.97-.97a.75.75 0 0 1 0-1.06Zm-4.94 6a.75.75 0 0 1 0 1.06l-.97.97h5.69a.75.75 0 0 1 0 1.5H4.56l.97.97a.75.75 0 1 1-1.06 1.06l-2.25-2.25a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                    </svg>
                </div>
                <button className="flex flex-row space-x-3 rounded-full border border-1 p-1">
                    <img
                        className="w-6 h-6"
                        src="https://asset.coinness.com/exchange/logo/binance.png?f=webp&w=64&h=64" />
                    <h1>바이낸스</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div>오늘의 환율은? {exchangeRateData[0].baseprice} 디비에 저장된 날짜는? {exchangeRateData[0].date}</div>

            <div>
                <table className="min-w-full mt-20">
                    <thead>
                        <tr>
                            <th className="text-left border-b text-sm text-gray-500 p-2">#</th>
                            <th className="text-left border-b text-sm text-gray-500 p-2">코인명</th>
                            <th className="text-right border-b text-sm text-gray-500 p-2" >업비트</th>
                            <th className="text-right border-b text-sm text-gray-500 p-2">바이낸스</th>
                            <th className="text-right border-b text-sm text-gray-500 p-2">가격차이(KRW)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td>비트코인</td>
                            <td>98,266,000원</td>
                            
                            <td>{btcPrice ? btcPrice : 'loading'}</td>
                            <td><span className="text-red-500">0.79% </span>769,325원</td>
                        </tr> */}
                        {/* {upbitBinance.map((item: any, index) => <tr key={index}>
                            <td>{item.koreanname}</td>
                            <td>업비트</td>
                            <td>{item.trade_price}</td>
                            <td>%{upbitBinance.length}개</td>
                        </tr>)} */}
                        {kimchi.map((item: any, index) => {
                            const tradePrice = item.trade_price;
                            const binanceTradePrice = item.binance_trade_price;
                            let kimchiPremium = null;
                            if (tradePrice !== undefined && binanceTradePrice !== undefined && binanceTradePrice > 0) {
                                kimchiPremium = ((tradePrice - binanceTradePrice) / binanceTradePrice) * 100;
                            }

                            return (<tr key={index} className="space-y-2 border-b border-slate-100 items-center">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2 flex flex-row space-x-2 items-center">
                                    <span><img src={item.image} className="w-6 h-6 rounded-full" /></span>
                                    <span className="font-medium">{item.shortname}</span>
                                    <span className="text-xs text-gray-500">{item.koreanname}</span>
                                </td>
                                <td className="text-right p-2">{item.trade_price?.toFixed(0)}원</td>
                                <td className="text-right p-2">{item.binance_trade_price?.toFixed(0)}원</td>
                                <td className="text-right p-2">
                                    <div className="flex flex-col">
                                        {(kimchiPremium !== null) && <span className={`${kimchiPremium > 0 ? "text-red-500" : "text-blue-600"}`}>{kimchiPremium.toFixed(2)}%</span>}
                                        {
                                            (item.binance_trade_price > 0)
                                            && <span>{parseFloat(item.trade_price?.toFixed(0)) - parseFloat(item?.binance_trade_price.toFixed(0))}원</span>
                                        }
                                    </div>
                                </td>
                            </tr>)
                        }
                        )}

                    </tbody>

                </table>
            </div>
        </div>
    )
}
