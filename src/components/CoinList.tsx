import React, { useEffect, useState } from "react";
import axios from "axios";


interface Market {
    market: string;
    korean_name: string;
    english_name: string;
}

const CoinList = () => {
    const [markets, setMarkets] = useState<Market[]>([]);
    useEffect(() => {//코인티커 가져오기
        axios.get("https://api.upbit.com/v1/market/all?isDetails=false")
            .then(response => {
                setMarkets(response.data)
            })
            .catch(error => {
                console.error("error: ", error);
            })
    }, [])

    return (<>
        <ul>
            {markets.map((market, index) => (<li key={index} className="flex items-center py-4">
                <span className="text-gray-600">{index + 1}</span>
                <strong className="m1-4">{market.korean_name}</strong>
                <span className="m1-auto mr-4 text-gray-500">{market.korean_name}</span>
                <span className="text-gray-500">{market.english_name}</span>
            </li>))}
        </ul>
    </>)
}
export default CoinList;