import React from 'react'
import { SevenDays } from './SevenDays'
import { CoinItemSkeleton } from './CoinItemSkeleton';
interface CoinItemProps {
    onClickWatched: (ticker: string) => void;
    item: {
        ticker: string;
        shortname: string;
        koreanname: string;
        image: string;
        trade_price: number;
        signed_change_rate: number;
        acc_trade_price_24h: number;
        change: string;
    };
    index: number;
    watchlist: string[];
    style?: React.CSSProperties;
}
export const CoinItem: React.FC<CoinItemProps> = ({ onClickWatched, item, index, watchlist, style }) => {
    if (!item || !item.signed_change_rate || !item.acc_trade_price_24h || !item.trade_price || !item.change) {
        return <CoinItemSkeleton />
    }
    return (
        <tr style={style}>
            <td onClick={() => { onClickWatched(item.ticker) }} className="whitespace-nowrap">
                <div className='flex justify-center items-center'>
                    {watchlist.includes(item.ticker)
                        ? <svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" strokeWidth="1.5" stroke="orange" className="size-6 w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gray" className="size-6 w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    }

                </div>
            </td>
            <td className="py-2 px-4 text-sm text-left">{index + 1}</td>
            <td className="whitespace-nowrap">
                <div className='flex items-center space-x-2'>
                    <span><img src={item.image} className="w-7 h-7 rounded-full" /></span>
                    <span className="font-medium">{item.shortname}</span>
                    <span className="text-xs text-gray-500 ml-2">{item.koreanname}</span>
                </div>

            </td>
            <td className={`${item.change === "RISE" ? "text-red-500" : "text-blue-600"} font-light`}>{item.trade_price?.toLocaleString('ko-KR')}</td>
            <td className={`${item.change === "RISE" ? "text-red-500" : "text-blue-600"} font-light`}>{(item.signed_change_rate * 100).toFixed(2)}%</td>
            <td className="font-light"> {item.acc_trade_price_24h?.toLocaleString('ko-KR')}</td>
            <td className="text-right"><SevenDays ticker={item.ticker} change={item.change} /></td>
        </tr>
    )
}
