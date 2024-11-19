import { useEffect, useRef, useState } from "react"
import useUpbitCoins from "../queries/upbitcoins";
import { IUpbitThemeCoins } from "../typings/db";
import { useSelector } from "react-redux";
//import { setUpbitThemes } from "../store/upbitThemeSlice";
import { RootState } from "../store/store";
import useUpbitThemes from "../hooks/useUpbitThemes";
import { useNavigate } from "react-router-dom";


export const Theme = () => {
    //const dispatch = useDispatch();
    //const [coins, setCoins] = useState<Coin[]>([]);
    //const [themes, setThemes] = useState<Themes[]>([])
    //const { data: upbitcoins, error: upbitError, isLoading: upbitLoading } = useUpbitCoins();
    const { isLoading: upbitLoading } = useUpbitCoins();
    //const [mappedThemes, setMappedThemes] = useState<IUpbitThemes[]>([]);
    const reduxThemes = useSelector((state: RootState) => state.theme.mappedThemes);
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const iconRef = useRef<HTMLDivElement | null>(null);


    useUpbitThemes();


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
    const handleCoinClick = (id: string) => {
        navigate(`/coin/${id}`)
    }
    const handleQuestionClick = () => {
        console.log("왜 안댐", isClicked)
        setIsClicked((prev) => !prev);
    }
    useEffect(() => {
        // console.log("머임", isClicked)
        const handleClickOutside = (event: any) => {
            if (popupRef.current && !popupRef.current.contains(event.target)
                && iconRef.current && !iconRef.current.contains(event.target)) {
                setIsClicked(false)
            }
        }
        if (isClicked) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }

    }, [isClicked])
    // const imsiSaveCoin = async () => {
    //     const result = await axios.get('https://reactcrypto-server-production.up.railway.app/api/theme')

    //     console.log('디비저장', result.data);
    // }

    if (upbitLoading) return <div>loading...</div>
    if (!reduxThemes) return <div>리덕스로딩</div>
    return (
        <div className="flex flex-col min-h-screen">
            <div className="container mx-auto px-16 lg:px-32 py-12">
                <div className="border-b border-b-slate-200 p-2 flex flex-row relative">
                    <div className="text-xl font-semibold ">테마</div>
                    <div onClick={handleQuestionClick} ref={iconRef} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>

                    </div>
                    {isClicked &&
                        <div ref={popupRef} className="absolute top-0 left-20 w-64 h-12 p-2 text-xs text-gray-400 border border-gray-300 bg-white rounded shadow-lg">
                            테마별 평균 가격은 업비트의 가격으로 하며 <br />매일 오전 9시 기준으로 업데이트됩니다
                        </div>}
                </div>
                {/* <button onClick={imsiSaveCoin}>db저장용 버튼</button> */}

                <div className="space-y-6 ">


                    {reduxThemes.map((item, index) => (<div key={index} className="flex flex-row space-x-4 space-y-5 border-b border-gray-200 p-4">
                        <div className="w-1/4 flex flex-col justify-center">
                            <div className="text-xl font-medium m-2">{item.name}</div>
                            <div className="text-xs text-gray-500 m-2">{item.description}</div>
                        </div>
                        <div className="w-2/4 space-y-4">
                            <div className="flex flex-row space-x-4 font-medium">
                                <div className="text-xs">{item.coins.length}개 중 {countRiseCoins(item.coins)}개 상승</div>
                                <div className="flex flex-row text-xs border-l border-gray-500 pl-4 space-x-1">
                                    <span className="font-semibold bg-[#30d5c8] text-xs p-1 rounded-lg">1위</span>
                                    <img src={setOneCoin(item.coins).image} className="self-center w-3 h-3 rounded-full" />
                                    <span>{setOneCoin(item.coins).shortname}</span>
                                    <span className={`${setOneCoin(item.coins).change === "RISE" ? "text-red-500" : "text-blue-600"}`}>{((setOneCoin(item.coins).signed_change_rate) * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                            <div className="flex flex-row flex-wrap space-x-1">
                                {item.coins.map((coin, idx) =>
                                    <div key={idx} onClick={() => { handleCoinClick(coin.shortname) }} className="flex m-1 text-xs text-gray-600 rounded-full border border-gray-400 inline-block px-2 py-1 ">
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
