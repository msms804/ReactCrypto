import React, { useEffect } from 'react'
import useUpbitThemes from '../hooks/useUpbitThemes'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

export const TrendingTheme = () => {
    const mappedThemes = useSelector((state: RootState) => state.theme.mappedThemes)

    useUpbitThemes();
    useEffect(() => {
        console.log("킁킁", mappedThemes)
    }, [mappedThemes])

    return (
        <div className='h-full flex flex-col '>
            {
                mappedThemes.slice(0, 3).map((item: any) => (
                    <div className='flex-1 bg-slate-100 rounded-xl'>
                        {item.name}
                    </div>))
            }
        </div>
    )
}
