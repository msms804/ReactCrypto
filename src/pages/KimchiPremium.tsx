import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import useUpbitCoins from "../queries/upbitcoins";

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
interface upbitBinance {
    koreanname: string,
    englishname: string,
    theme: string,
    ticker: string,
    shortname: string,
    image: string,
    cryptoExchange: string,
    trade_price: string,
}
//https://binance-docs.github.io/apidocs/websocket_api/en/#general-api-information
/**
 * 
 * 바이낸스는 rate limit 이 있음. 
 * 그래서 뭔가 처리해줘야
 * 1. 일단 리액트쿼리로 업비트 리스트 가져온다 --> o
 * 2. shortname에 usdt붙이고 toUpperCase    --> o
 * --> 그리고 바이낸스에서 받은것과 비교
 * 3. 새로운 state에서 find해서 바이낸스 코인매핑
 * 가져올때 usdt인것을 가져와야함, 그리고 원화로 바꿔야
 * 4. 렌더링
 * 
 * !!! 알고리즘 !!!
 * 
 * 리스트 순서를 김프순으로 해도될지도,,
 * 
 */
export const KimchiPremium = () => {
    const [coinExchange, setCoinExchange] = useState([{
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
    const [btcPrice, setBtcPrice] = useState(null);
    const { data: upbitcoins, error: upbitError, isLoading: upbitLoading } = useUpbitCoins();
    const [upbitshortname, setUpbitShortName] = useState([]);//바이낸스에 보낼 티커 배열
    const [upbitBinance, setUpbitBinance] = useState<upbitBinance[]>([])

    useEffect(() => {
        if (upbitcoins) {
            console.log("캐싱", upbitcoins);
            //upbitcoins.shortname += usdt@trade
            //아.. shortname으로 하면안되네.. 개기찮아..
            const upbitdata = upbitcoins.map((item: any) => item.shortname.toLowerCase() + "usdt@trade")
            const upbitKrwData = upbitcoins.filter((item: any) => (
                item.ticker.startsWith("KRW-")
            ))
            const upbitKrwShortname = upbitKrwData.map((item: any) => item.shortname.toLowerCase() + "usdt@trade")
            console.log(upbitKrwShortname.length);
            setUpbitShortName(upbitKrwShortname);   //이거 krw만 보내도록 바꿔야

            setUpbitBinance(upbitKrwData);

            /**
             * 1. 캐싱한 데이터에서 krw에 해당하는 코인의 shortname을 배열로 만든다 --> 완
             * 2. 바이낸스로 보낸다 --> 완
             * 3. 바이낸스에서 받은 데이터를 setUpbitBinance에 매핑한다.
             * 4. 원화로 바꿔서 렌더링(바이낸스 실시간데이터)
             * 
             * 5.  리덕스에 업비트 실시간데이터 저장한다. 
             * 6. 4의 순서에 맞춰서 렌더링(거래대금순)
             * 
             * 7. 무한스크롤 구현
             */

        }
    }, [upbitcoins])
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
        let isSubscribed = true;

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


            // data.s가 존재하고, USDT를 포함하는지 확인
            if (data.s && data.s.includes("USDT")) {
                const symbol = data.s.split("USDT")[0];
                console.log("바이낸스", symbol, "가격: ", data.p);
                setUpbitBinance(prev => prev.map((item: any) =>
                    (item.shortname === symbol)
                        ? {
                            ...item,
                            trade_price: data.p
                        } : item
                ))

            }
            //   if (data && data.e === "trade") {
            //     const updatedPrices = { ...prices };

            //     if (data.s === "BTCUSDT") {
            //       updatedPrices.BTC = data.p;
            //     } else if (data.s === "ETHUSDT") {
            //       updatedPrices.ETH = data.p;
            //     } else if (data.s === "SOLUSDT") {
            //       updatedPrices.SOL = data.p;
            //     }

            //     if (isSubscribed) {
            //       setPrices(updatedPrices);
            //     }
            //   }
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        return () => {
            isSubscribed = false;
            ws.close();
        };
    }, [upbitshortname])//upbitBinance도 deps에 넣으니까 소켓오류남
    const onClickCoinExchange = () => {
        setOpen(prev => !prev);
    }
    //아.. 비교할땐 업비트의 usdt랑 비교해야겠네.. 아님 krw 변환해도될지도..
    if (upbitLoading) return <div>로딩중</div>
    return (
        <div className="container mx-auto px-32 mt-16">
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
            <div>
                <table className="min-w-full mt-20">
                    <thead>
                        <tr>
                            <th className="bg-gray-100 text-left">코인명</th>
                            <th className="bg-gray-100 text-left" >업비트</th>
                            <th className="bg-gray-100 text-left">바이낸스</th>
                            <th className="bg-gray-100 text-left">가격차이(퍼센트포함)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>비트코인</td>
                            <td>98,266,000원</td>
                            {/* <td>97,496,674원</td> */}
                            <td>{btcPrice ? btcPrice : 'loading'}</td>
                            <td><span className="text-red-500">0.79% </span>769,325원</td>
                        </tr>
                        {upbitBinance.map((item: any, index) => <tr key={index}>
                            <td>{item.koreanname}</td>
                            <td>업비트</td>
                            <td>{item.trade_price}</td>
                            <td>%{upbitBinance.length}개</td>
                        </tr>)}

                    </tbody>

                </table>
            </div>
        </div>
    )
}
