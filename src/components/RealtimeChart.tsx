
const RealtimeChart = () => {
    //그리드1이 아니라 여기서 flex-wrap해야하는건가/..?
    //reactive -trader는 그리드로 했음
    return (<>

        <div className="md:grid grid-cols-3">{
            [1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="w-20 h-16 border-2 border-blue-400 m-3 p-2">
                    실시간차트
                </div>
            ))
        }
        </div>
    </>)
}
export default RealtimeChart;