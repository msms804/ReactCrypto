import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

const data = [{
    name: '토',
    cnt: 10,
},
{
    name: '일',
    cnt: 19,
},
{
    name: '월',
    cnt: 10,
},
{
    name: '화',
    cnt: 34,
},
{
    name: '수',
    cnt: 10,
},
{
    name: '목',
    cnt: 8,
},
{
    name: '오늘',
    cnt: 22,
},]
const Chart = () => {//data를 app 에서 props로 넘겨주면될듯

    return (<>
        <LineChart width={730} height={250} data={data}
            margin={{
                top: 10,
                right: 0,
                left: 0,
                bottom: 0,
            }} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart >
    </>)
}
export default Chart;