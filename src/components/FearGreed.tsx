import React, { useEffect, useState } from 'react'
import axios from 'axios'
//https://alternative.me/crypto/fear-and-greed-index/

export const FearGreed = () => {
    const [fearGreedIdx, setFearGreedIdx] = useState('');
    const getFearGreedIdx = async () => {
        try {
            const response = await axios.get('https://api.alternative.me/fng/')
            //console.log("공포탐욕지수:", response)
            console.log("공포탐욕지수는:", response.data.data[0].value)
            setFearGreedIdx(response.data.data[0].value);
        } catch (error) {
            console.error("Error fetching the Fear and Greed Index:", error);
        }
    }
    useEffect(() => {
        getFearGreedIdx();
    }, [])
    return (
        <div>FearGreed:{fearGreedIdx} </div>
    )
}
