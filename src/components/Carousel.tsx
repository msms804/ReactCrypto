import { useState } from 'react'
import { Slide } from './Slide';

export const Carousel = () => {
    //여기서 페칭해야함
    const [markets] = useState(["나스닥", "S&P 500", "다우존스", "테더", "코스피", "코스닥", "비트코인", "이더리움"])
    return (
        <>

            <Slide markets={markets} />
        </>

    )
}
