import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const useUpbitCoins = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["upbitdata"],
        queryFn: async () => {
            const response = await axios.get('https://reactcrypto-server-production.up.railway.app/api/upbit/coins/list')
            return response.data;
        }
    })
    return { data, error, isLoading };
}
export default useUpbitCoins;