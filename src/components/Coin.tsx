import { useEffect, useState } from "react";
import axios from "axios";
const Coin = () => {
    const [ticker, setTicker] = useState();
    useEffect(() => {
        axios.get("https://api.upbit.com/v1/market/all?isDetails=false")
            .then(response => {
                setTicker(response.data);
                console.log("ticker:", ticker);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [])
    return (<>
    </>)
}
export default Coin;