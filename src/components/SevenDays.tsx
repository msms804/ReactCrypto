import { useEffect, useState, memo, useRef } from 'react'
import axios from 'axios';
import { createChart, ColorType } from 'lightweight-charts';

interface Candle {
  market: string;
  data: {
    candle_date_time_utc: string;
    opening_price: number;
    trade_price: number;
    candle_acc_trade_price: number;
  }[];
}
interface SevenDaysProps {
  ticker: string;
}
/**
 * 
 * 알고리즘 :
 * 1. 코인리스트 컴포넌트에서 props로 티커명 보내준다.
 * 2. 받은 티커명으로 그 티커의 해당하는 7일치 캔들 페치
 * 3. 차트 렌더링 . tradingview 차트 쓰는게 나을듯
 * 4. 렌더링할때 종가만 가지고 렌더링해야. 실선렌더링
 * 
 * 왜 차트 계속 렌더링됨? 막아야함
 */
export const SevenDays = memo(({ ticker }: SevenDaysProps) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  useEffect(() => {
    const fetchCandles = async () => {
      try {
        const sevenCandles = await axios.get('https://api.upbit.com/v1/candles/days', {
          params: {
            market: "KRW-BTC",
            to: new Date().toISOString().replace('.000Z', '+00:00'),  // KST 형식으로 변환
            count: 7,
            convertingPriceUnit: "KRW",
          }
        });
        console.log("7캔들", sevenCandles.data);
      } catch (error: any) {
        console.error("Error fetching candles:", error.response ? error.response.data : error.message);
      }
    }
    fetchCandles();

  }, [ticker])


  const sevenDaysChart = (props: any) => {

  }
  const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
  ];

  /** 
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
          console.log(candles);
        } catch (error) {
          console.error("Error fetching candle data:", error);
        }
  
      }
      fetchCandles();
    }, [])
  
  */
  return (
    <div>왜이래;;</div>
  )
})



// Memoize the component and specify the props type explicitly
