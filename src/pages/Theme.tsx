import axios from "axios"
import { useEffect, useState } from "react"
interface Coins {
    name: string,
    ticker: string,
}

export const Theme = () => {
    const [coins, setCoins] = useState<Coins[]>([]);
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
    return (
        <div>
            Theme
            <div>
                {coins.map((item) => (item.name))}
            </div>
        </div>
    )
}
