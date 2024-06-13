import axios from "axios"
import { useEffect, useState } from "react"
import useUpbitCoins from "../queries/upbitcoins";
interface Coin {
    theme: string,
    ticker: string,
    image: string,
    trade_price: number,
}
interface Themes {
    theme: string,
    name: string,
    description: string,
    coins: string[],
}
//최종
interface NewCoins {
    ticker: string,
    image: string,
    shortname: string,
    signed_change_rate: number,
    change: string,
}
interface NewThemes {
    theme: string,
    name: string,
    description: string,
    coins: NewCoins[],
}
/**
 * 
 * 알고리즘 : 
 * 1. 디비에서 theme을 영어로 지어야
 * 2. 코인리스트에 있는 해당 theme에 해당하는거 다 state에 저장?
 * 저장하는 구조를 어케하지.. 배열안에 객체..? 너무 복잡하지 않나..
 * 3. 업비트의 현재가 정보로 가져와서 가격 매핑. 
 * 4. 렌더링
 * 
 * 1위 2위 3위 이런건 어케정하지..
 * 
 * 이거도 리덕스로 관리해야함
 * 
 * 여기서 몬가 promise all을 쓸 수있을거같은데..
 * theme 각각 서버에 요청해야하니까
 * 
 * 그냥 테마가 있는 코인들만 가져오면 되지않을까? theme이 빈문자열인거 빼고
 * 그냥 렌더링을프론트에서 처리. 테마별로 filter함수 쓰면될거같기도
 * 
 * {
      theme: 'rwa',
      percentage: 4.2, (rwa테마의 평균 상승률)
      coins: [
        { koreanname: '온도파이낸스', ticker: "krw-ondo", change: 30.0 },
        // other stocks...
      ]
    },

    그리고 저장하는건 훅에서 해야할걸?
 */

export const Theme = () => {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [themes, setThemes] = useState<Themes[]>([])
    const { data: upbitcoins, error: upbitError, isLoading: upbitLoading } = useUpbitCoins();
    const [mappedThemes, setMappedThemes] = useState<NewThemes[]>([]);


    useEffect(() => {// 이거 걍 리액트쿼리로 빼도?
        const fetchThemes = async () => {
            const result = await axios.get('http://localhost:8080/api/theme')
            console.log("테마", result.data);
            result.data.map((item: any) => console.log(item.coins))
            setThemes(result.data)
            if (upbitcoins) {
                console.log(upbitcoins);
            }

        }
        fetchThemes();
    }, [])

    //이미지 매핑
    useEffect(() => {
        //filter함수 써볼까
        //먼저 for문으로 매핑하고 그다음 개선해보자. promise All?

        console.log(themes);
        //이렇게 하면안되고.. 테마를 기준으로 해야하는디
        if (upbitcoins) {
            const mappedTheme = themes.map((theme: any) => {
                const mappedCoins = theme.coins.map((ticker: any) => {
                    const upbitcoin = upbitcoins.find((item: any) => item.ticker === ticker)
                    return {
                        ticker: ticker,
                        image: upbitcoin.image,
                        shortname: upbitcoin.shortname,
                        //change: upbitcoin.change, --> 이건 현재가 정보 가져올때 해야~
                    }
                })
                return {
                    theme: theme.theme,
                    name: theme.name,
                    description: theme.description,
                    coins: mappedCoins,
                }
            })
            setMappedThemes(mappedTheme)


        }
    }, [themes, upbitcoins])
    useEffect(() => {
        console.log("최종: ", mappedThemes)
        //여기서 또 가격매핑해야
        //힌트 : flatMap
        // const response = axios.get('https://api.upbit.com/v1/ticker')

        const fetchUpbitPrice = async () => {
            // const result = themes.map((item: any) => item.coins).flat().join(',');
            // console.log("띰", result);
            const tickers = mappedThemes.flatMap(theme => theme.coins.map(coin => coin.ticker));
            const uniqueTickers = [...new Set(tickers)].join(',');

            try {
                const response = await axios.get(`https://api.upbit.com/v1/ticker?markets=${uniqueTickers}`)
                console.log("후우움", response.data);

                //여기서 가격 매핑
                const finalThemes = mappedThemes.map((theme: any) => {
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

                        // return {
                        //     ...ticker, //이게맞나..
                        //     trade_price: result.trade_price,
                        // }
                    })
                    return {
                        theme: theme.theme,
                        name: theme.name,
                        description: theme.description,
                        coins: coinlist,
                    }
                })
                console.log(finalThemes);
                setMappedThemes(finalThemes);
            } catch (error) {
                console.log(error);
            }
        }
        if (mappedThemes) {
            fetchUpbitPrice();
        }
    }, [mappedThemes, themes])
    const calculateAvgChangeRate = (coins: NewCoins[]) => {//item.coins를 넘겨줌
        /**
         * 알고리즘
         * 1. 
         */
        // let tmp = [{x : 1}, {x: 2}, {x: 3}].reduce((accumulator, currentValue) => accumulator + currentValue.x);
        // countRiseCoins(coins);
        var initialValue = 0;

        var sum2 = coins.reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue.signed_change_rate,
            initialValue,
        )
        return sum2;
    }
    const countRiseCoins = (coins: NewCoins[]) => {
        // filter 써야겟네
        console.log("몇개 상승?", coins)
        const result = coins.filter((item: any) => item.change === "RISE")
        console.log(result);
        return result.length;
    }

    if (upbitLoading) return <div>loading...</div>
    return (
        <div className="flex flex-col min-h-screen">
            <div className="container mx-auto px-16 lg:px-32 py-12">
                <div className="text-xl font-semibold border-b border-b-slate-200 p-2">
                    테마
                </div>

                <div className="space-y-6 ">
                    {mappedThemes.map((item, index) => (<div key={index} className="flex flex-row space-x-4 space-y-5 ">
                        <div className="w-1/4 flex flex-col justify-center">
                            <div className="text-xl font-medium m-2">{item.name}</div>
                            <div className="text-xs text-gray-500 m-2">{item.description}</div>
                        </div>
                        <div className="w-2/4">
                            <div className="flex flex-row space-x-2">
                                <div className="text-xs text-gray-400">{item.coins.length}개 중 {countRiseCoins(item.coins)}개 상승</div>
                                <div className="flex flex-row text-xs text-gray-400">{item.coins.slice(0, 1).map((c, i) => <div className="flex flex-row">
                                    {i + 1}위
                                    <img src={c.image} className="w-3 h-3 rounded-full" />
                                    <span className="text-xs">{c.shortname}</span>
                                    <span className="text-xs text-red-500">{c.signed_change_rate}%</span>
                                </div>)}</div>
                            </div>
                            <div className="flex flex-row flex-wrap space-x-1">
                                {item.coins.map((coin, idx) =>
                                    <div key={idx} className="flex m-1 text-xs text-gray-600 rounded-full border border-gray-400 inline-block px-2 py-1 ">
                                        <img src={coin.image} className="w-4 h-4 rounded-full" />
                                        <span>{coin.shortname}</span>
                                    </div>)}
                            </div>
                        </div>
                        <div className="w-1/4">
                            <div className="text-sm text-red-600 bg-red-100 inline-block p-2 rounded">
                                {calculateAvgChangeRate(item.coins).toFixed(2)}%
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>

        </div>
    )
}
