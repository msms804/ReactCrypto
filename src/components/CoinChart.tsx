import React, { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

export const CoinChart = ({ props }: any) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const chart = createChart(container, {
            width: container.clientWidth,
            height: 200,
            layout: {
                background: { color: '#ffffff' },
                textColor: '#000000',
            },
            grid: {
                vertLines: {
                    color: '#e0e0e0',
                },
                horzLines: {
                    color: '#e0e0e0',
                },
            },
            // priceScale: {
            //     borderColor: '#e0e0e0',
            // },
            timeScale: {
                borderColor: '#e0e0e0',
            },
        });
        const candleSeries = chart.addCandlestickSeries();
        fetch(`https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1d&limit=365`)
            .then(response => response.json())
            .then(data => {
                const chartData = data.map((item: any) => ({
                    time: item[0] / 1000,
                    open: parseFloat(item[1]),
                    high: parseFloat(item[2]),
                    low: parseFloat(item[3]),
                    close: parseFloat(item[4]),
                }));
                candleSeries.setData(chartData);
            })
        return () => chart.remove();

    }, [])
    return (
        <div ref={chartContainerRef}></div>
    )
}
