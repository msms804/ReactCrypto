import React, { useEffect, useState } from 'react'
import axios from 'axios'
interface Candle {
  market: string;
  data: {
    candle_date_time_utc: string;
    opening_price: number;
    trade_price: number;
    candle_acc_trade_price: number;
  }[];
}
export const SevenDays = () => {
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    const fetchCandles = async () => {
      const markets = ['KRW-BTC', 'KRW-SOL', 'KRW-ETH', 'KRW-DOGE'];
      const to = new Date().toISOString();
      const count = 7;
      const promises = markets.map(market =>
        axios.get('https://api.upbit.com/v1/candles/days', { params: { market, to, count } })
      );
      try {
        const responses = await Promise.all(promises);
        const allCandles = responses.map((response, index) => ({
          market: markets[index],
          data: response.data
        }));
        setCandles(allCandles);
      } catch (error) {
        console.error("Error fetching candle data:", error);
      }

    }
    fetchCandles();
  }, [])
  return (
    <div>SevenDays</div>
  )
}
