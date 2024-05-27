import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import moment from 'moment';

//https://alternative.me/crypto/fear-and-greed-index/

export const FearGreed = () => {
    const [fearGreedIdx, setFearGreedIdx] = useState<number | null>(null);
    const [oneDayAgo, setOneDayAgo] = useState();
    const [sevenDaysAgo, setSevenDaysAgo] = useState();
    const [oneMonthAgo, setOneMonthAgo] = useState();
    const chartOptions: ApexOptions = {
        chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: 0,//-90
                endAngle: -360,   //90
                track: {
                    background: '#e7e7e7',
                    strokeWidth: '97%',
                    margin: 5,
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: 5,
                        fontSize: '18px',
                        formatter: function (val) {
                            return Math.round(val).toString();
                        }
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -10
            }
        },
        labels: ['Index'],
        colors: ['#00E396'],
    };
    const chartOptions2: ApexOptions = {
        chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: 90,//-90
                endAngle: -90,   //90
                track: {
                    background: '#e7e7e7',
                    strokeWidth: '97%',
                    margin: 5,
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: 5,
                        fontSize: '18px',
                        formatter: function (val) {
                            return Math.round(val).toString();
                        }
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -10
            }
        },
        labels: ['Index'],
        colors: ['#00E396', '#FEB019', '#FF4560']
    };
    const chartSeries = fearGreedIdx !== null ? [fearGreedIdx] : [];

    const getFearGreedIdx = async () => {
        try {
            const response = await axios.get('https://api.alternative.me/fng/', {
                params: {
                    limit: 31,
                    format: 'json',
                }
            })
            const allData = response.data.data;

            // 현재 날짜를 Unix 타임스탬프로 변환
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = Math.floor(today.getTime() / 1000);

            // 어제, 7일 전, 한달 전 날짜 계산
            const oneDayAgoTimestamp = todayTimestamp - 86400; // 1일 = 86400초
            const sevenDaysAgoTimestamp = todayTimestamp - 7 * 86400;
            const oneMonthAgoTimestamp = todayTimestamp - 30 * 86400; // 약 30일로 계산

            const filterData = (timestamp: any) => {
                return allData.find((item: any) => {
                    const itemDate = new Date(item.timestamp * 1000);
                    itemDate.setHours(0, 0, 0, 0);
                    return Math.floor(itemDate.getTime() / 1000) === timestamp;
                });
            };

            // 데이터 필터링
            const todayData = filterData(todayTimestamp);
            const oneDayAgoData = filterData(oneDayAgoTimestamp);
            const sevenDaysAgoData = filterData(sevenDaysAgoTimestamp);
            const oneMonthAgoData = filterData(oneMonthAgoTimestamp);
            console.log("씨이발", todayData, oneDayAgoData)
            setOneDayAgo(oneDayAgoData.value);
            setSevenDaysAgo(sevenDaysAgoData.value);
            setOneMonthAgo(oneMonthAgoData.value);



            //console.log("공포탐욕지수:", response)
            const indexValue = parseInt(response.data.data[0].value, 10)
            console.log("공포탐욕지수는:", indexValue)
            setFearGreedIdx(indexValue);
        } catch (error) {
            console.error("Error fetching the Fear and Greed Index:", error);
        }
    }
    useEffect(() => {
        getFearGreedIdx();
    }, [])
    return (<>
        <div className='flex flex-row x-2'>
            <div className='bg-gray-100 w-3/5 rounded-xl mr-2'>
                {fearGreedIdx !== null ? (
                    <ReactApexChart options={chartOptions} series={chartSeries} type="radialBar" height="200" />
                ) : (
                    <div>Loading...</div> // 로딩 중일 때 표시
                )}
            </div>
            <div className='w-2/5 flex flex-col'>
                {oneDayAgo && <div className='bg-gray-100 mb-2 h-1/3'>어제: {oneDayAgo} </div>}
                {sevenDaysAgo && <div className='bg-gray-100 mb-2 h-1/3'>7일전: {sevenDaysAgo} </div>}
                {oneMonthAgo && <div className='bg-gray-100 h-1/3'>1달전: {oneMonthAgo} </div>}
            </div>
        </div>

        {/* <div className="text-center mt-4">
            <div className="text-xl font-bold">{fearGreedLabel}</div>
            <div className="text-sm text-gray-500">
                Market sentiment is {fearGreedLabel.toLowerCase()}, many assets may be {fearGreedLabel === 'Extreme Greed' ? 'overpriced' : 'underpriced'}.
            </div>
        </div> */}
        {/* <div className="relative w-full h-4 mt-4 bg-gray-200 rounded-full">
                    <div className="absolute top-0 h-4 rounded-full bg-gradient-to-r from-yellow-400 via-green-400 to-green-500" style={{ width: `${fearGreedIdx}%` }}></div>
                    <div className="absolute top-0 h-4 w-4 bg-white border-2 border-green-500 rounded-full" style={{ left: `calc(${fearGreedIdx}% - 8px)` }}></div>
                </div> */}

    </>
    )
}
