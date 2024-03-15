import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


interface Market {
    market: string;
    korean_name: string;
    english_name: string;
    price: number;
}

const CoinList = () => {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [tickers, setTickers] = useState([]);
    const [bitTicker, setBitTicker] = useState();
    const [prices, setPrices] = useState();
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
        const ws = new WebSocket("wss://api.upbit.com/websocket/v1");

        ws.onopen = () => {
            console.log("connected");
            ws.send(JSON.stringify([
                { "ticket": uuidv4() },
                { "type": "ticker", "codes": ["KRW-BTC"] },
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
                setPrices(receivedData.trade_price);
                // setBTC(receivedData.trade_price)
                // setRate(parseFloat((receivedData.signed_change_rate * 100).toFixed(2)));
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
        console.log(markets)
    }, [markets])

    useEffect(() => {//이거때문에 소켓통신 끊김 왜?
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
            {markets.map((market, index) => (<li key={index} className="flex items-center py-4">
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