import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useThemeCoinsPrice = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['coinsPrice'],
        queryFn: async () => {
            const response = await axios.get('https://reactcrypto-server-production.up.railway.app/api/theme/coins')
            return response.data;
        }
    })
    return { data, error, isLoading };
}
export default useThemeCoinsPrice;