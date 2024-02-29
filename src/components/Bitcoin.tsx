import { useEffect, useState } from "react";
//import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
/**
 * 1. 반감기까지 남은 day
 * 2. 반감기까지 남은 day 시 분 초
 * 3. 현재 비트코인 블록수
 * 4. 남은 블록수?
 * 5. 현재가격 (원 , 달러, 1일 상승퍼센테이지)
 * 남은 데이 어케구함
 * 1/1~현재날짜 구하고, 1/1반감기날짜 구해서 빼기?
 */
const Bitcoin = () => {
    const [btc, setBTC] = useState<number | null>(null);
    const [rate, setRate] = useState<number | null>(null);
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
                setBTC(receivedData.trade_price)
                setRate(parseFloat((receivedData.signed_change_rate * 100).toFixed(2)));
            });
        }
        ws.onclose = () => {
            console.log("closed");
        }

        return () => {
            ws.close();
        }
    }, [])
    useEffect(() => {
        console.log(btc)
    }, [btc]);
    return (<>
        <strong>현재 비트코인가격은 : {btc}원</strong>
        <div>전일대비 : {rate} %</div>
    </>)
}
export default Bitcoin;