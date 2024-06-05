
export const KimchiPremium = () => {

    //아.. 비교할땐 업비트의 usdt랑 비교해야겠네.. 아님 krw 변환해도될지도..
    return (
        <div className="container mx-auto px-32 mt-16">
            <div className="font-semibold text-2xl">
                김치 프리미엄
            </div>
            <div className="flex flex-row space-x-6 mt-12 justify-center ">
                <button className="flex flex-row space-x-3 rounded-full border border-1 p-1">
                    <img
                        className="w-6 h-6"
                        src="https://asset.coinness.com/exchange/logo/7dcea0013b4ec6942b703c52967c159b.png?f=webp&w=64&h=64" />
                    <h1>업비트</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M10.47 2.22a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H5.75a.75.75 0 0 1 0-1.5h5.69l-.97-.97a.75.75 0 0 1 0-1.06Zm-4.94 6a.75.75 0 0 1 0 1.06l-.97.97h5.69a.75.75 0 0 1 0 1.5H4.56l.97.97a.75.75 0 1 1-1.06 1.06l-2.25-2.25a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                    </svg>
                </div>
                <button className="flex flex-row space-x-3 rounded-full border border-1 p-1">
                    <img
                        className="w-6 h-6"
                        src="https://asset.coinness.com/exchange/logo/binance.png?f=webp&w=64&h=64" />
                    <h1>바이낸스</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div>
                <table className="min-w-full mt-20">
                    <thead>
                        <tr>
                            <th className="bg-gray-100 text-left">코인명</th>
                            <th className="bg-gray-100 text-left" >업비트</th>
                            <th className="bg-gray-100 text-left">바이낸스</th>
                            <th className="bg-gray-100 text-left">가격차이(퍼센트포함)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>비트코인</td>
                            <td>98,266,000원</td>
                            <td>97,496,674원</td>
                            <td><span className="text-red-500">0.79% </span>769,325원</td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>
    )
}
