import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

//https://alternative.me/crypto/fear-and-greed-index/

export const FearGreed = () => {
    const [fearGreedIdx, setFearGreedIdx] = useState<number | null>(null);
    const [oneDayAgo, setOneDayAgo] = useState<number | null>(null);
    const [sevenDaysAgo, setSevenDaysAgo] = useState<number | null>(null);
    const [oneMonthAgo, setOneMonthAgo] = useState<number | null>(null);
    const chartOptions: ApexOptions = {
        chart: {
            type: 'radialBar',
            offsetY: 0,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -360,//-90
                endAngle: 0,   //90
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
                        offsetY: 10,
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
            offsetY: 0,
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
                        offsetY: 8,
                        fontSize: '16px',
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
            //const todayData = filterData(todayTimestamp);
            const oneDayAgoData = filterData(oneDayAgoTimestamp);
            const sevenDaysAgoData = filterData(sevenDaysAgoTimestamp);
            const oneMonthAgoData = filterData(oneMonthAgoTimestamp);
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
        <div className='flex flex-row space-x-2'>
            <div className='bg-gray-100 w-3/5 rounded-xl'>
                <div className='place-items-start'>
                    {fearGreedIdx !== null ? (
                        <ReactApexChart options={chartOptions} series={chartSeries} type="radialBar" height="130" />
                    ) : (
                        <div>Loading...</div> // 로딩 중일 때 표시
                    )}
                </div>
                <div>
                    greed
                </div>
                <div className='flex gap-1 mt-2'>
                    <div className='w-1/4 bg-[#FF4560] h-2 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#FEB019] h-2 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#00E396] h-2 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#00E396] h-2 mt-2 rounded-lg'></div>
                </div>

            </div>
            <div className='w-2/5 flex flex-col'>
                {/* <div className='flex flex-row '>
                    {oneDayAgo !== null && (<div className='bg-gray-100 mb-2 h-1/3 rounded-xl w-1/4 flex w-full'>
                        <div className='w-1/4'>
                            <ReactApexChart options={chartOptions2} series={[oneDayAgo]} type="radialBar" height="70" />
                        </div>
                        <div className='w-3/4 flex items-center justify-center'>
                            Yesterday
                        </div>
                    </div>)}
                </div> */}
                {oneDayAgo && <div className='bg-gray-100 mb-2 h-1/3 rounded-xl'>
                    <div className=' test flex flex-row items-center'>
                        <div className='w-1/3'>
                            <ReactApexChart options={chartOptions2} series={[oneDayAgo]} type="radialBar" height="60" />
                        </div>
                        <div className='w-2/3 p-3'>
                            <div className='text-sm font-semibold'>어제</div>
                            <div className='text-sm'>greed</div>

                        </div>

                    </div>

                </div>}

                {sevenDaysAgo && <div className='bg-gray-100 mb-2 h-1/3 rounded-xl'>
                    <div className=' test flex flex-row items-center'>
                        <div className='w-1/3'>
                            <ReactApexChart options={chartOptions2} series={[sevenDaysAgo]} type="radialBar" height="60" />
                        </div>
                        <div className='w-2/3 p-3'>
                            <div className='text-sm font-semibold'>7일전</div>
                            <div className='text-sm'>greed</div>

                        </div>

                    </div>

                </div>}
                {oneMonthAgo && <div className='bg-gray-100 mb-2 h-1/3 rounded-xl'>
                    <div className=' test flex flex-row items-center'>
                        <div className='w-1/3'>
                            <ReactApexChart options={chartOptions2} series={[oneMonthAgo]} type="radialBar" height="60" />
                        </div>
                        <div className='w-2/3 p-3'>
                            <div className='text-sm font-semibold'>한달전</div>
                            <div className='text-sm'>greed</div>

                        </div>

                    </div>

                </div>}
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
