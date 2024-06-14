import { IUpbitThemes, IUpbitThemeCoins } from "../typings/db";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useUpbitCoins from "../queries/upbitcoins";
import axios from "axios";
import { setUpbitThemes } from "../store/upbitThemeSlice";

//여기서 테마별 평균도 넣어야
const useUpbitThemes = () => {
    const dispatch = useDispatch();
    const { data: upbitcoins, error: upbitError, isLoading: upbitLoading } = useUpbitCoins();
    const [themes, setThemes] = useState<IUpbitThemes[]>();
    const [mappedUpbitThemes, setMappedUpbitThemes] = useState<IUpbitThemes[]>();

    //db에서 코인별 theme 가져옴
    useEffect(() => {
        const fetchUpbitThemes = async () => {
            const result = await axios.get('http://localhost:8080/api/theme')
            setThemes(result.data)
            //console.log("..", result.data)
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
            //--> 이게아니라 바로 리덕스에 저장해야
            // console.log(",.", mappedTheme);
            dispatch(setUpbitThemes(mappedTheme))
        }
    }, [upbitcoins, themes, dispatch])

    //코인가격 매핑
    useEffect(() => {
        const fetchUpbitPrice = async () => {
            const tickers = mappedUpbitThemes?.flatMap((theme) => theme.coins.map(coin => coin.ticker));
            const uniqueTickers = [...new Set(tickers)].join(',');

            if (uniqueTickers) {
                try {
                    const response = await axios.get(`https://api.upbit.com/v1/ticker?markets=${uniqueTickers}`)
                    const finalThemes = mappedUpbitThemes?.map((theme: any) => {
                        const coinlist = theme.coins.map((ticker: any) => {
                            const result = response.data.find((item: any) => item.market === ticker.ticker)
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
                        console.log(",.", finalThemes);//여기서 에러남
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
    }, [mappedUpbitThemes, dispatch])



}
export default useUpbitThemes;