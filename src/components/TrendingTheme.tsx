import { useEffect, useState } from 'react'
import useUpbitThemes from '../hooks/useUpbitThemes'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { IUpbitThemes, IUpbitThemeCoins } from '../typings/db'

interface UpbitCoins {
    ticker: string,
    image: string,
    shortname: string,
    signed_change_rate: number,
    change: string,
}
interface UpbitThemes {
    theme: string,
    name: string,
    description: string,
    avg_change_rate: number,
    coins: UpbitCoins[],
}
export const TrendingTheme = () => {
    const [upbitTheme, setUpbitTheme] = useState<UpbitThemes[]>();
    const mappedThemes = useSelector((state: RootState) => state.theme.mappedThemes as IUpbitThemes[])

    useUpbitThemes();

    useEffect(() => {
        console.log("", mappedThemes)

        const mappedUpbitThemes: UpbitThemes[] = mappedThemes.map((item: any) => {
            const avgChangeRate = calculateAvgChangeRate(item.coins);
            console.log("", calculateAvgChangeRate(item.coins));
            return {
                ...item,
                avg_change_rate: avgChangeRate,
            }
        }).sort((a, b) => b.avg_change_rate - a.avg_change_rate);
        console.log("", mappedUpbitThemes);
        setUpbitTheme(mappedUpbitThemes.slice(0, 3));
    }, [mappedThemes])

    const calculateAvgChangeRate = (coins: IUpbitThemeCoins[]) => {//item.coins를 넘겨줌
        var initialValue = 0;

        var sum = coins.reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue.signed_change_rate,
            initialValue,
        )
        return (sum * 100) / coins.length;
    }


    return (
        <div className='h-full flex flex-col  space-y-2'>
            {/* {
                mappedThemes.slice(0, 3).map((item: any) => (
                    <div className='flex-1 bg-slate-100 rounded-xl'>
                        {item.name}
                    </div>))
            } */}
            {
                upbitTheme?.map((item, idx) => (
                    <div key={idx} className='flex flex-1 bg-slate-100 rounded-lg justify-between'>
                        <div className='flex flex-row space-x-4 items-center ml-2'>{/* items-center 추가 */}
                            <span className='font-medium'>{idx + 1}</span>
                            <div className='flex -space-x-3 overflow-hidden w-20'>
                                {
                                    item.coins.slice(0, 3).map((coin, idx) =>
                                        <img key={idx} className="w-7 h-7 rounded-full inline-block ring-1 ring-blue-200 bg-white" src={coin.image} />
                                    )
                                }
                            </div>
                            <span className='font-medium text-sm'>{item.name}</span>
                        </div>
                        <div className='flex items-center'> {/* items-center 추가 */}
                            <span className='text-red-500 font-medium mr-2 text-sm'>{item.avg_change_rate.toFixed(2)}%</span>

                        </div>
                    </div>
                ))
            }

        </div>
    )
}
