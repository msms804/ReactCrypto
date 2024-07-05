import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import useFearGreedIdx from '../queries/fearAndGreedIdx';
import { useQueryClient } from '@tanstack/react-query';
import { IFearGreedIdx } from '../typings/db';

//https://alternative.me/crypto/fear-and-greed-index/

export const FearGreed = () => {
    const [fearGreedIdx, setFearGreedIdx] = useState<number | null>(null);
    const [oneDayAgo, setOneDayAgo] = useState<number | null>(null);
    const [sevenDaysAgo, setSevenDaysAgo] = useState<number | null>(null);
    const [oneMonthAgo, setOneMonthAgo] = useState<number | null>(null);
    const { data: idxData, error: idxError, isLoading: idxLoading } = useFearGreedIdx();
    const queryClient = useQueryClient();

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
                        offsetY: 9,
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

    const fetchFearGreedIdx = async () => {
        try {
            const response = await axios.get('https://api.alternative.me/fng/', {
                params: {
                    limit: 31,
                    format: 'json',
                }
            })
            const allData = response.data.data;
            console.log("공탐지수 찍어봄", allData);

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

            const indexValue = parseInt(response.data.data[0].value, 10)
            console.log("공포탐욕지수는:", indexValue)
            setFearGreedIdx(indexValue);
            return {
                todayIdx: indexValue,
                yesterdayIdx: oneDayAgoData.value,
                sevenDaysIdx: sevenDaysAgoData.value,
                oneMonthIdx: oneMonthAgoData.value,
                todayclassification: response.data.data[0].value_classification,
                yesterdayclassification: oneDayAgoData.value_classification,
                sevenDaysclassification: sevenDaysAgoData.value_classification,
                oneMonthclassification: oneMonthAgoData.value_classification,
            }
        } catch (error) {
            console.error("Error fetching the Fear and Greed Index:", error);
        }
    }
    useEffect(() => {
        const fetchAndSaveFearAndGreedIdx = async () => {
            if (!idxData) {
                console.error("idxData가 비어있거나 정의되지 않았습니다.");
                return;
            }
            const latestDate = idxData.date;
            const lastUpdated = dayjs(latestDate);
            const now = dayjs();
            if (!latestDate || now.diff(lastUpdated, 'day') >= 1) {
                const result = await fetchFearGreedIdx();
                const today = dayjs().format('YYYY-MM-DD');
                //이거 today로 하면 안됨. timestamp 변형해서 해야
                await axios.post('http://localhost:8080/api/save/feargreedIdx',
                    { ...result, today }
                );
                queryClient.invalidateQueries({ queryKey: ['fearandgreedIdx'] })
            }
        }
        fetchAndSaveFearAndGreedIdx();
    }, [queryClient, idxData])

    if (idxLoading) return <div>공탐지수 loading</div>
    return (<>
        <div className='flex flex-row space-x-2'>
            <div className='bg-slate-100 w-3/5 rounded-xl'>
                <div className='flex flex-row'>
                    <div className='place-items-start'>
                        {idxData !== null ? (
                            <ReactApexChart options={chartOptions} series={[idxData.todayIdx]} type="radialBar" height="130" />
                        ) : (
                            <div>Loading...</div> // 로딩 중일 때 표시
                        )}
                    </div>
                    <div>
                        {idxData.todayclassification}
                    </div>
                    <div>
                        받은날짜 : {idxData.date}
                    </div>
                </div>

                <div className='flex gap-1 mt-2 pl-4 pr-4'>
                    <div className='w-1/4 bg-[#FF4560] h-1 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#FEB019] h-1 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#00E396] h-1 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#00E396] h-1 mt-2 rounded-lg'></div>
                </div>

            </div>
            <div className='w-2/5 flex flex-col'>
                {idxData && <div className='bg-slate-100 mb-2 h-1/3 rounded-xl'>
                    <div className=' test flex flex-row items-center'>
                        <div className='w-1/3'>
                            <ReactApexChart options={chartOptions2} series={[idxData.yesterdayIdx]} type="radialBar" height="60" />
                        </div>
                        <div className='w-2/3 p-3'>
                            <div className='text-xs font-bold'>어제</div>
                            <div className='text-sm'>{idxData.yesterdayclassification}</div>

                        </div>

                    </div>

                </div>}

                {idxData && <div className='bg-slate-100 mb-2 h-1/3 rounded-xl'>
                    <div className=' test flex flex-row items-center'>
                        <div className='w-1/3'>
                            <ReactApexChart options={chartOptions2} series={[idxData.sevenDaysIdx]} type="radialBar" height="60" />
                        </div>
                        <div className='w-2/3 p-3'>
                            <div className='text-xs font-bold'>7일전</div>
                            <div className='text-sm'>{idxData.sevenDaysclassification}</div>

                        </div>

                    </div>

                </div>}
                {idxData && <div className='bg-slate-100 mb-2 h-1/3 rounded-xl'>
                    <div className=' test flex flex-row items-center'>
                        <div className='w-1/3'>
                            <ReactApexChart options={chartOptions2} series={[idxData.oneMonthIdx]} type="radialBar" height="60" />
                        </div>
                        <div className='w-2/3 p-3'>
                            <div className='text-xs font-bold'>한달전</div>
                            <div className='text-sm'>{idxData.oneMonthclassification}</div>

                        </div>

                    </div>

                </div>}
            </div>
        </div>
    </>
    )
}
