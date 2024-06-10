import { v4 as uuidv4 } from 'uuid';
import { IUpbit } from '../typings/db';
import useUpbitCoins from "../queries/upbitcoins";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUpbit, updateUpbitPrice } from '../store/store';

const useUpbitWebsocket = () => {
    //굳이 이걸 파라미터로 받아야하나?
    const { data: upbitcoins, error: upbitError, isLoading: upbitLoading } = useUpbitCoins();
    const dispatch = useDispatch();

    useEffect(() => {
        const ws = new WebSocket("wss://api.upbit.com/websocket/v1")
        if (upbitcoins) {
            const upbitTicker = upbitcoins.map((item: any) => item.ticker)
            //리덕스에 코인저장
            dispatch(setUpbit(upbitcoins))

            ws.onopen = () => {
                console.log("connected");
                ws.send(JSON.stringify([
                    { "ticket": uuidv4() },
                    { "type": "ticker", "codes": upbitTicker },
                    { "format": "DEFAULT" },
                ]))
            }
            ws.onerror = (err) => {
                console.error("Websocket error: ", err)
            }

            ws.onmessage = (event) => {
                event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
                    const decoder = new TextDecoder("utf-8");
                    const text = decoder.decode(buffer);
                    const receivedData = JSON.parse(text);
                    console.log("훅으로 받는 업비트데이터", receivedData);

                    //이제 여기서 실시간 가격 업데이트해야

                    dispatch(updateUpbitPrice({
                        upbitticker: receivedData.code,
                        upbitTradePrice: receivedData.trade_price,
                        upbitacc: receivedData.acc_trade_price_24h,
                        upbitchangerate: receivedData.signed_change_rate,
                        upbitchange: receivedData.change,
                    }))
                    //여기서 매핑
                    // if (receivedData && upbitcoins) {
                    //     const result = upbitcoins.map((item: any) => (item.ticker === receivedData.code) ?
                    //         {
                    //             ...item,
                    //             trade_price: receivedData.trade_price,
                    //             acc_trade_price: receivedData.acc_trade_price,
                    //             signed_change_rate: receivedData.signed_change_rate, //등락폭
                    //             change: receivedData.change,    //상승, 보합, 하락

                    //         } : item
                    //     )
                    //     //여기서 store로 보내야
                    // }
                })

            }
            ws.onclose = () => {
                console.log("소켓 closed")
            }
            return () => {
                ws.close();
            }

        }

    }, [upbitcoins])

}
export default useUpbitWebsocket;
