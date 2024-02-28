import { useEffect, useState } from "react";
//import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

const Bitcoin = () => {
    const [btc, setBTC] = useState(null);
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
    </>)
}
export default Bitcoin;