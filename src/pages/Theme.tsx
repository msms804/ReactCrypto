import axios from "axios"
import { useEffect, useState } from "react"
interface Coins {
    name: string,
    ticker: string,
}
interface Themes {
    theme: string,
    description: string,
}

export const Theme = () => {
    const [coins, setCoins] = useState<Coins[]>([]);
    const [themes, setThemes] = useState<Themes[]>([])
    //걍 theme을 객체로만드는게..
    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const result = await axios.get('http://localhost:8080/api/coins')
                console.log("서버량 연결테스트", result.data);
                setCoins(result.data);
            } catch (error) {
                console.log("서버 연결 실패", error);
            }
        }
        fetchCoins();
    }, [])
    useEffect(() => {// 이거 걍 리액트쿼리로 빼도?
        const fetchThemes = async () => {
            const result = await axios.get('http://localhost:8080/api/theme')
            console.log("테마", result.data);
            setThemes(result.data)
        }
        fetchThemes();
    }, [])
    //아.. 테마는 거래소 상관없이 해야할듯.. / 상세페이지에서 업비트 빗썸 나눠나야지
    return (
        <div className="flex flex-col min-h-screen">
            <div className="container mx-auto px-16 lg:px-32 py-12">
                <div className="text-xl font-semibold border-b border-b-slate-200">
                    테마
                </div>

                <div className="space-y-6 ">
                    {themes.map((item, index) => (<div key={index} className="flex flex-row space-x-4 space-y-5">
                        <div className="w-1/4 flex flex-col justify-center">
                            <div className="text-xl font-medium">{item.theme}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                        <div className="w-2/4 flex flex-col justify-center">
                            <div className="text-xs text-gray-400">n개 중 m개 상승</div>
                            <div className="text-xs text-gray-600 rounded-full border border-gray-400 inline-block px-2 py-1">상승률 1위 코인</div>
                            <div className="text-xs text-gray-600 rounded-full border border-gray-400 inline-block px-2 py-1">상승률 2위 코인</div>
                            <div className="text-xs text-gray-600 rounded-full border border-gray-400 inline-block px-2 py-1">상승률 3위 코인</div>
                        </div>
                        <div className="w-1/4 flex flex-col justify-center">
                            <div className="text-xs text-red-600 bg-red-100 inline-block p-1">섹터 평균 상승률</div>
                        </div>
                    </div>))}
                </div>
            </div>

        </div>
    )
}
