import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import axios from 'axios';
//https://startatage30.tistory.com/29
//위에거를 일단 클론코딩하자. 코인종목 옆에 가격 실시간
//cors 이슈 해결해야
/*
1. 차트 컴포넌트 만들어보기
https://www.npmjs.com/package/lightweight-charts
2. 소켓통신으로 그 블로그처럼 해보기

*/
function App() {
  const [data, setData] = useState(null);//
  const [charts, setChart] = useState([]);
  const [btc, setBTC] = useState(null);

  useEffect(() => {
    axios.get("https://api.upbit.com/v1/market/all?isDetails=true")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    //일 캔들 가져오기
    axios.get("https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200")
      .then(response => setBTC(response.data))
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    //console.log("data:", data);
    console.log("btc candle", btc);
  }, [btc])

  return (
    <>
      {/* 데이터를 화면에 표시하는 코드 */}
      괄호문제는 왜 안되는지 꼭확인할것
      syntax error input~
      SyntaxError: Unexpected end of input
    </>
  )
}

export default App
/**
 * 
   useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("https://api.upbit.com/v1/market/all", {
          method: 'GET',
          mode: 'no-cors',
          headers: { accept: "application/json" }
        });
        const json = await res.json();
        console.log(json);
      } catch (err) {
        console.log(err);
      }
    }, 0);
 
    return () => {
      clearTimeout(timer);
    };
  }, []);
useEffect(() => {
  fetch("https://api.upbit.com/v1/market/all?isDetails=true", {
    method: 'GET',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => { response.json() })
    .catch(error => console.error('Error:', error));
}, []);
 */

