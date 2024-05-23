import React, { useEffect, useState } from "react";
import axios, { all } from "axios";
import { v4 as uuidv4 } from 'uuid';


interface Market {
    market: string;
    korean_name: string;
    english_name: string;
    price: number;
}

const CoinList = () => {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [bitTicker, setBitTicker] = useState();
    const [prices, setPrices] = useState();

    const [tickers, setTickers] = useState([]);
    const [allPrices, setAllPrices] = useState<string[] | undefined>();

    useEffect(() => {//코인티커 가져오기
        axios.get("https://api.upbit.com/v1/market/all?isDetails=false")
            .then(response => {
                setMarkets(response.data)
                //setTickers(response.data.market)
            })
            .catch(error => {
                console.error("error: ", error);
            })
    }, [])

    useEffect(() => {
        const marketList = markets.map(item => item.market);
        setAllPrices(marketList);
    }, [markets])

    useEffect(() => {
        const ws = new WebSocket("wss://api.upbit.com/websocket/v1");

        ws.onopen = () => {
            console.log("connected");
            ws.send(JSON.stringify([
                { "ticket": uuidv4() },
                //1. 여기서 "codes"에 보내는거 markets의 모든 market로 매핑?해서 보내야
                { "type": "ticker", "codes": ["KRW-BTC"] },
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
                setBitTicker(receivedData.code);
                //setPrices(prevPrices => [...prevPrices, receivedData.trade_price]);
                setPrices(receivedData.trade_price);
                //여기다 tickers에 티커네임만 매핑해야
                //2. 여기서 모든 가격 받아야

                /**
                 * 3/20 할것 --> 수도코드임
                 * 1. 일단 marketList를 리스트가 아니라 객체로 만들어야할수도..?
                 * 2. 소켓에서 데이터 받아오면
                 * 3. marketList에서 티커에 해당하는 가격 갈아끼움
                 */
            });
        }
        ws.onclose = () => {
            console.log("머임closed");
        }

        return () => {
            ws.close();
        }
    }, [])
    useEffect(() => {
        //console.log("markets : ", markets)
        console.log("새로만든 가격리스트 : ", allPrices)
    }, [allPrices])

    useEffect(() => {
        console.log("소켓으로 받은가격", prices)
    }, [prices])

    useEffect(() => {//3. 네임에 해당하는 가격들 매핑하고 렌더링
        if (prices !== undefined && bitTicker === markets[0]?.market) {
            const copyData = markets.map(coin => ({ ...coin, price: prices }));
            setMarkets(copyData);
        }
    }, [bitTicker, markets[0]?.market, prices])

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
     */
    return (<>
        <ul>
            {markets.slice(0, 10).map((market, index) => (<li key={index} className="flex items-center py-4">
                <span className="text-gray-600">{index + 1}</span>
                <strong className="m1-4">{market.korean_name}</strong>
                <span className="m1-auto mr-4 text-gray-500">{market.korean_name}</span>
                <span className="text-gray-500">{market.english_name}</span>
                <span className="text-gray-900">현재가 : {market.price}</span>
            </li>))}
        </ul>
    </>)
}
export default CoinList;