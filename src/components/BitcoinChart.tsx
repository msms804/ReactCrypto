import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import axios from 'axios';

//https://hgko-dev.tistory.com/142
interface CandleData {
    trade_price: number;
}
//으 머리아파.. 로그차트로 되나?
const BitcoinChart = () => {//data를 app 에서 props로 넘겨주면될듯
    const [tradePrice, setTradePrice] = useState<number[]>([])

    useEffect(() => {
        axios.get("https://api.upbit.com/v1/candles/months?market=KRW-BTC&count=200")
            .then(response => {
                //이렇게 매핑해야함
                const candleData: CandleData[] = response.data;
                const reversedArray = candleData.map(item => item.trade_price);
                //이거 숫자가 거꾸로된듯
                const closingPrices = [...reversedArray].reverse();
                setTradePrice(closingPrices)
                //종가를 가져와야함 종가는 trade_price
            })
            .catch(error => console.error(error))
    }, [])

    useEffect(() => {
        console.log("종가 : ", tradePrice)
    }, [tradePrice])

    return (<>
        <div id='chart'>
            <Chart
                type="line"
                series={[
                    {
                        name: "비트코인 월봉",
                        data: tradePrice,
                    },
                ]}
                options={{
                    chart: {
                        height: 500,
                        width: 500,
                    },

                    annotations: {
                        xaxis: [{
                            x: new Date('11 May 2020').getTime(),
                        }]
                    }
                }}>
            </Chart>
            <div id='html-dist'></div>
        </div>
    </>)
}
export default BitcoinChart;
/**
 *     const [series, setSeries] = useState([{
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }])
    const [options, setOptions] = useState({
        chart: {
            height: 350,

            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Product Trends by Month',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
    },
    )

 */