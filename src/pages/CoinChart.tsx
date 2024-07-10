import React from 'react'
import { useParams } from 'react-router-dom'
/**
 * 
 * 1. 클릭하면 해당 라우트로 넘어가게?, 
 * 2. 클릭할때 props로 해당 코인 정보도 넘겨주기
 * 3. 그 상세페이지에서 useParams로 현재 
 */
export const CoinChart = () => {
    const { id } = useParams();
    return (
        <div>
            <div>비트코인 {id}</div>
            <div>82,645,000원</div>
            <div>전일대비 0.74%</div>
            <div>트뷰차트</div>
        </div>
    )
}
