import axios from "axios"
import { useEffect, useState } from "react"
import useUpbitCoins from "../queries/upbitcoins";
import { IUpbitThemes, IUpbitThemeCoins } from "../typings/db";
import { useSelector, useDispatch } from "react-redux";
import { setUpbitThemes } from "../store/upbitThemeSlice";
import { RootState } from "../store/store";
import useUpbitThemes from "../hooks/useUpbitThemes";

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
/**
 * 
 * 알고리즘 : 
 * 1. 디비에서 theme을 영어로 지어야
 * 2. 코인리스트에 있는 해당 theme에 해당하는거 다 state에 저장?
 * 저장하는 구조를 어케하지.. 배열안에 객체..? 너무 복잡하지 않나..
 * 3. 업비트의 현재가 정보로 가져와서 가격 매핑. 
 * 4. 렌더링
 * 여기서 몬가 promise all을 쓸 수있을거같은데..
 * theme 각각 서버에 요청해야하니까
 * 
 * 그냥 테마가 있는 코인들만 가져오면 되지않을까? theme이 빈문자열인거 빼고
 * 그냥 렌더링을프론트에서 처리. 테마별로 filter함수 쓰면될거같기도
 * 
 그리고 저장하는건 훅에서 해야할걸?
 */

export const Theme = () => {
    const dispatch = useDispatch();
    const [coins, setCoins] = useState<Coin[]>([]);
    const [themes, setThemes] = useState<Themes[]>([])
    const { data: upbitcoins, error: upbitError, isLoading: upbitLoading } = useUpbitCoins();
    const [mappedThemes, setMappedThemes] = useState<IUpbitThemes[]>([]);
    const reduxThemes = useSelector((state: RootState) => state.theme.mappedThemes);
    useUpbitThemes();

    useEffect(() => {
        console.log("리덕스 테스트", reduxThemes)
    }, [reduxThemes])



    const calculateAvgChangeRate = (coins: IUpbitThemeCoins[]) => {//item.coins를 넘겨줌
        // let tmp = [{x : 1}, {x: 2}, {x: 3}].reduce((accumulator, currentValue) => accumulator + currentValue.x);
        // countRiseCoins(coins);
        var initialValue = 0;

        var sum = coins.reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue.signed_change_rate,
            initialValue,
        )
        return (sum * 100) / coins.length;
    }
    const countRiseCoins = (coins: IUpbitThemeCoins[]) => {
        // filter 써야겟네
        setOneCoin(coins)
        console.log("몇개 상승?", coins)
        const result = coins.filter((item: any) => item.change === "RISE")
        console.log(result);
        return result.length;
    }
    const setOneCoin = (coins: IUpbitThemeCoins[]) => {
        //배열복사해서 정렬해야 원본 안바뀜
        const sortedCoins = [...coins].sort((a, b) => b.signed_change_rate - a.signed_change_rate)
        console.log("1등코인 ", sortedCoins[0])
        return sortedCoins[0];
    }
    if (upbitLoading) return <div>loading...</div>
    if (!reduxThemes) return <div>리덕스로딩</div>
    return (
        <div className="flex flex-col min-h-screen">
            <div className="container mx-auto px-16 lg:px-32 py-12">
                <div className="text-xl font-semibold border-b border-b-slate-200 p-2">
                    테마
                </div>

                <div className="space-y-6 ">


                    {reduxThemes.map((item, index) => (<div key={index} className="flex flex-row space-x-4 space-y-5 ">
                        <div className="w-1/4 flex flex-col justify-center">
                            <div className="text-xl font-medium m-2">{item.name}</div>
                            <div className="text-xs text-gray-500 m-2">{item.description}</div>
                        </div>
                        <div className="w-2/4 space-y-4">
                            <div className="flex flex-row space-x-4 font-medium">
                                <div className="text-xs">{item.coins.length}개 중 {countRiseCoins(item.coins)}개 상승</div>
                                <div className="flex flex-row text-xs border-l border-gray-500 pl-4 space-x-1">
                                    <span className="font-semibold text-blue-500 text-sm">1위</span>
                                    <img src={setOneCoin(item.coins).image} className="self-center w-3 h-3 rounded-full" />
                                    <span>{setOneCoin(item.coins).shortname}</span>
                                    <span className={`${setOneCoin(item.coins).change === "RISE" ? "text-red-500" : "text-blue-600"}`}>{((setOneCoin(item.coins).signed_change_rate) * 100).toFixed(2)}%</span>
                                </div>
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
                            <div className="text-sm text-blue-600 bg-blue-100 inline-block p-2 rounded">
                                {calculateAvgChangeRate(item.coins).toFixed(2)}%
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>

        </div>
    )
}
