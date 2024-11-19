import { useEffect, useState, memo } from 'react'
import axios from 'axios';
//import { createChart, ColorType } from 'lightweight-charts';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';


interface SevenDaysProps {
  ticker: string;
  change: string;
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
export const SevenDays = memo(({ ticker, change }: SevenDaysProps) => {
  // const [candles, setCandles] = useState<Candle[]>([]);
  const [tradePrice, setTradePrice] = useState([]);
  //const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [colors, setColors] = useState<string>("");
  //const [chartOptions, setChartOptions] = useState<ApexOptions>()
  useEffect(() => {
    console.log("props로 받은 ticker:", ticker);
    console.log("props로 받은 change", change);

    const newColor = (change === "RISE") ? "#F44336" : "#F44336"
    setColors(newColor)

    const fetchCandles = async () => {
      try {
        const sevenCandles = await axios.get('https://api.upbit.com/v1/candles/days', {
          params: {
            market: ticker,
            to: new Date().toISOString().replace('.000Z', '+00:00'),  // KST 형식으로 변환
            count: 30,
            convertingPriceUnit: "KRW",
          }
        });
        console.log("7캔들", sevenCandles.data);
        const newTradePrice = sevenCandles.data.map((item: any) => (
          item.trade_price
        ))
        console.log("종가: ", newTradePrice)
        setTradePrice(newTradePrice.reverse());
      } catch (error: any) {
        console.error("Error fetching candles:", error.response ? error.response.data : error.message);
      }
    }
    fetchCandles();

  }, [ticker, change])

  //차트렌더링 
  //참고 : https://tradingview.github.io/lightweight-charts/tutorials/react/simple 
  // https://apexcharts.com/docs/react-charts/
  const chartOptions2: ApexOptions = {
    chart: {
      type: 'line',
      offsetY: 0,
      sparkline: {
        enabled: true
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
    stroke: {
      curve: 'smooth',
      width: 1, // 라인의 굵기를 1로 설정합니다.
    },
    colors: [colors]


  }



  return (
    <div >
      <ReactApexChart options={chartOptions2} series={[
        {
          name: "series-1",
          data: tradePrice,
        }
      ]} type='line' height="50" width="150" />
    </div>
  )
})



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
