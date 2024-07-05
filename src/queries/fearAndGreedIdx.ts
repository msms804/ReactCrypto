import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFearGreedIdx = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["fearandgreedIdx"],
        queryFn: async () => {
            const response = await axios.get('http://localhost:8080/api/fearAndGreedIdx')
            return response.data;
        }
    })
    return { data, error, isLoading };
}
export default useFearGreedIdx;