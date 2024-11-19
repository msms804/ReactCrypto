import { IUpbitThemes } from "../typings/db";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useUpbitCoins from "../queries/upbitcoins";
import axios from "axios";
import { setUpbitThemes } from "../store/upbitThemeSlice";
import useThemeCoinsPrice from "../queries/themecoinsPrice";
import { useQuery } from "@tanstack/react-query";
//여기서 테마별 평균도 넣어야
const useUpbitThemes = () => {
    const dispatch = useDispatch();
    const { data: upbitcoins, isLoading: upbitLoading } = useUpbitCoins();
    const [themes, setThemes] = useState<IUpbitThemes[]>();
    const [mappedUpbitThemes, setMappedUpbitThemes] = useState<IUpbitThemes[]>();
    //const { data: themecoins, error: coinsError, isLoading: coinsLoading } = useThemeCoinsPrice();
    const { data: themecoins } = useThemeCoinsPrice();

    //db에서 코인별 theme 가져옴
    useEffect(() => {
        const fetchUpbitThemes = async () => {
            const result = await axios.get('https://reactcrypto-server-production.up.railway.app/api/theme')
            //console.log("..", result.data)
            const filteredThemes = result.data.filter((item: any) => item.theme !== "ALL")
            //setThemes(result.data)
            setThemes(filteredThemes);

        }
        fetchUpbitThemes();
    }, [])

    //코인 이미지 매핑
    useEffect(() => {
        if (upbitcoins && themes) {
            const mappedTheme = themes.map((theme: any) => {
                const mappedCoins = theme.coins.map((ticker: any) => {
                    const upbitcoin = upbitcoins.find((item: any) => item.ticker === ticker)
                    return {
                        ticker: ticker,
                        image: upbitcoin.image,
                        shortname: upbitcoin.shortname,
                    }
                })
                return {
                    theme: theme.theme,
                    name: theme.name,
                    description: theme.description,
                    coins: mappedCoins,
                }
            })

            setMappedUpbitThemes(mappedTheme);
            dispatch(setUpbitThemes(mappedTheme))
        }
    }, [upbitcoins, themes, dispatch])

    useEffect(() => {
        // themecoins.nextUpdate > 현재시각 --> 갱신할 필요 x

        // themecoins.nextUpdate < 현재시각 --> 갱신해야
        //const now = dayjs();
        // if (!themecoins.nextUpdate || dayjs(themecoins.nextUpdate).isAfter(now)) {
        // 업비트 api 요청

        //db에 새로 update

        // invalidate Queries
        // }

    }, [themecoins])
    // 코인 가격을 가져오는 useQuery 훅(업비트 API 요청)
    const { data: priceData, isLoading: priceLoading } = useQuery({
        queryKey: ["upbitPrices", mappedUpbitThemes],
        queryFn: async () => {
            const tickers = mappedUpbitThemes?.flatMap((theme) => theme.coins.map(coin => coin.ticker));
            const uniqueTickers = [...new Set(tickers)].join(',');
            if (uniqueTickers) {
                const response = await axios.get(`https://api.upbit.com/v1/ticker?markets=${uniqueTickers}`)
                return response.data;
            }
            return [];
        },
        enabled: !!mappedUpbitThemes,//데이터가 있을때만 요청
        staleTime: 1000 * 60 * 30, //30분(staleTime을 30분으로 설정)
        gcTime: 1000 * 60 * 60, //1시간(30분 이상으로 설정하여 캐시보관)
        refetchOnWindowFocus: false,  // 포커스 변경 시 리패치 방지
    })


    //코인가격 매핑
    useEffect(() => {
        const fetchUpbitPrice = async () => {
            const tickers = mappedUpbitThemes?.flatMap((theme) => theme.coins.map(coin => coin.ticker));
            const uniqueTickers = [...new Set(tickers)].join(',');

            if (priceData && uniqueTickers) {
                try {
                    // const response = await axios.get(`https://api.upbit.com/v1/ticker?markets=${uniqueTickers}`)
                    const finalThemes = mappedUpbitThemes?.map((theme: any) => {
                        const coinlist = theme.coins.map((ticker: any) => {
                            const result = priceData.find((item: any) => item.market === ticker.ticker)
                            console.log("종가", result.trade_price)
                            return {
                                ticker: ticker.ticker,
                                signed_change_rate: result.signed_change_rate,
                                change: result.change,
                                image: ticker.image,
                                shortname: ticker.shortname,
                            }

                        })
                        return {
                            theme: theme.theme,
                            name: theme.name,
                            description: theme.description,
                            coins: coinlist,
                        }
                    })
                    if (finalThemes) {
                        setMappedUpbitThemes(finalThemes);
                        //여기서 dispatch
                        console.log("무한루프", finalThemes);//여기서 에러남
                        dispatch(setUpbitThemes(finalThemes));
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        if (mappedUpbitThemes) {
            fetchUpbitPrice();
        }
    }, [priceData, dispatch])

    return {//이게 머임..?
        themes: mappedUpbitThemes,
        isLoading: upbitLoading || priceLoading, //로딩상태병합
    }

}
export default useUpbitThemes;