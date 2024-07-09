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
                    limit: 32,
                    format: 'json',
                }
            })
            const allData = response.data.data;
            console.log("공탐지수 찍어봄", allData);

            // 현재 날짜를 Unix 타임스탬프로 변환
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = Math.floor(today.getTime() / 1000);
            // const today = dayjs().startOf('day');
            // const todayTimestamp = today.unix();


            // 어제, 7일 전, 한달 전 날짜 계산
            const oneDayAgoTimestamp = todayTimestamp - 2 * 86400; // 1일 = 86400초
            const sevenDaysAgoTimestamp = todayTimestamp - 8 * 86400;
            const oneMonthAgoTimestamp = todayTimestamp - 31 * 86400; // 약 30일로 계산
            // const oneDayAgoTimestamp = today.subtract(1, 'day').unix();
            // const sevenDaysAgoTimestamp = today.subtract(7, 'day').unix();
            // const oneMonthAgoTimestamp = today.subtract(30, 'day').unix();

            const filterData = (timestamp: any) => {
                return allData.find((item: any) => {
                    const itemDate = new Date(item.timestamp * 1000);
                    itemDate.setHours(0, 0, 0, 0);
                    return Math.floor(itemDate.getTime() / 1000) === timestamp;
                    // const itemDate = dayjs.unix(item.timestamp).startOf('day');
                    // return itemDate.unix === timestamp;
                });
            };

            // 데이터 필터링
            //const todayData = filterData(todayTimestamp);
            const oneDayAgoData = filterData(oneDayAgoTimestamp);
            const sevenDaysAgoData = filterData(sevenDaysAgoTimestamp);
            const oneMonthAgoData = filterData(oneMonthAgoTimestamp);

            const remainingTime = parseInt(response.data.data[0].time_until_update, 10);
            //const timeStamp = dayjs.unix(response.data.data[0].timestamp).format('YYYY-MM-DD');
            const nextUpdateDate = dayjs().add(remainingTime, 'second');

            setOneDayAgo(oneDayAgoData.value);
            setSevenDaysAgo(sevenDaysAgoData.value);
            setOneMonthAgo(oneMonthAgoData.value);

            const indexValue = response.data.data[0].value
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
                nextUpdateDate: nextUpdateDate.format('YYYY-MM-DD HH:mm:ss'),
            }
        } catch (error) {
            console.error("Error fetching the Fear and Greed Index:", error);
        }
    }
    /**
     * 알고리즘
     * 1. db에 다음 업데이트 예정시간 같이 저장한다
     * 2. 만약 예정시간보다 현재시간이 뒤라면 새로 api요청, db저장
     * 3. 현재시간이 앞이라면 db에서 꺼낸거 계속 쓴다.
     */
    useEffect(() => {
        const fetchAndSaveFearAndGreedIdx = async () => {
            if (!idxData) {
                console.error("idxData가 비어있거나 정의되지 않았습니다.");
                return;
            }
            const now = dayjs();
            const nextUpdate = idxData.nextUpdateDate;
            //nextUpdate는 항상 현재시간보다 많아야
            if (!nextUpdate || dayjs(nextUpdate).isBefore(now)) {//nextUpdate < now
                console.log("리액트쿼리 갱신해야 ㅎㅇㅎㅇ");
                const result = await fetchFearGreedIdx();
                const today = dayjs().format('YYYY-MM-DD');
                await axios.post('http://localhost:8080/api/save/feargreedIdx',
                    { ...result, today }
                );
                queryClient.invalidateQueries({ queryKey: ['fearandgreedIdx'] })

            }
            // if (!latestDate || now.diff(lastUpdated, 'day') >= 1) {
            //     const result = await fetchFearGreedIdx();
            //     const today = dayjs().format('YYYY-MM-DD');
            //     //이거 today로 하면 안됨. timestamp 변형해서 해야
            //     await axios.post('http://localhost:8080/api/save/feargreedIdx',
            //         { ...result, today }
            //     );
            //     queryClient.invalidateQueries({ queryKey: ['fearandgreedIdx'] })
            // }
        }
        fetchAndSaveFearAndGreedIdx();
    }, [queryClient, idxData])


    const getColorByClassification = (classification: string) => {
        switch (classification) {
            case 'Extreme Fear':
                return '#FF4560';
            case 'Fear':
                return '#FEB019';
            case 'Neutral':
                return '#FFD400';
            case 'Greed':
                return '#A0D468';
            case 'Extreme Greed':
                return '#008d62';
            default:
                return '#00E396';
        }
    }
    const todayColor = idxData ? getColorByClassification(idxData.todayclassification) : '#00E396';
    const yesterdayColor = idxData ? getColorByClassification(idxData.yesterdayclassification) : '#00E396';
    const sevenDaysColor = idxData ? getColorByClassification(idxData.sevenDaysclassification) : '#00E396';
    const oneMonthColor = idxData ? getColorByClassification(idxData.oneMonthclassification) : '#00E396';

    // 점의 위치 계산 함수 (0 ~ 100 범위, 각 구간 20씩 나눔)
    const calculateDotPosition = (value: any) => {
        const totalWidth = 100; // 바의 전체 너비를 100으로 가정
        const position = (value / 100) * totalWidth;
        return position;
    };

    const dotPosition = idxData ? calculateDotPosition(idxData.todayIdx) : 0;
    if (idxLoading) return <div>공탐지수 loading</div>
    return (<>
        <div className='flex flex-row space-x-2'>
            <div className='bg-slate-100 w-3/5 rounded-xl'>
                <div className='flex flex-row'>
                    <div className='flex justify-items-start items-start w-1/2'>
                        {idxData !== null ? (
                            <ReactApexChart options={{ ...chartOptions, colors: [todayColor] }} series={[idxData.todayIdx]} type="radialBar" height="130" style={{ alignSelf: 'flex-start' }} />
                        ) : (
                            <div>Loading...</div> // 로딩 중일 때 표시
                        )}
                    </div>
                    <div className='mt-2 flex flex-col justify-center items-center pr-4 w-1/2'>
                        <div className='text-sm font-bold'>오늘</div>
                        <div className='text-sm'>{idxData.todayclassification}</div>
                    </div>
                </div>
                <div className='text-xs pl-4 pr-4 text-gray-500'>공포탐욕지수는 하루에 한번 갱신됩니다.</div>

                <div className='relative flex gap-1 mt-2 pl-4 pr-4'>
                    <div className='w-1/4 bg-[#FF4560] h-1 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#FEB019] h-1 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#FFD400] h-1 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#A0D468] h-1 mt-2 rounded-lg'></div>
                    <div className='w-1/4 bg-[#008d62] h-1 mt-2 rounded-lg'></div>
                    <div className='absolute top-0 mt-1' style={{ left: `calc(${dotPosition}% - 6px)` }}>
                        <div className='bg-white w-3 h-3 rounded-full border-2 border-gray-800'></div>
                    </div>
                </div>

            </div>
            <div className='w-2/5 flex flex-col'>
                {idxData && <div className='bg-slate-100 mb-2 h-1/3 rounded-xl'>
                    <div className=' test flex flex-row items-center'>
                        <div className='w-1/3'>
                            <ReactApexChart options={{ ...chartOptions2, colors: [yesterdayColor] }} series={[idxData.yesterdayIdx]} type="radialBar" height="60" />
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
                            <ReactApexChart options={{ ...chartOptions2, colors: [sevenDaysColor] }} series={[idxData.sevenDaysIdx]} type="radialBar" height="60" />
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
                            <ReactApexChart options={{ ...chartOptions2, colors: [oneMonthColor] }} series={[idxData.oneMonthIdx]} type="radialBar" height="60" />
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
