import RealtimeChart from "../components/RealtimeChart";
const Grid1 = () => {

    return (<>
        <div
            className=" p-4 border-pink-500 border-2 h-screen  flex-row flex-wrap space-y-2"
        >
            그리드 1
            {/* <BitcoinChart /> */}
            <RealtimeChart />
        </div>
    </>)
}
export default Grid1;