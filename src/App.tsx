import { useEffect, useState } from 'react'
import axios from 'axios';
import BitcoinChart from './components/BitcoinChart';
import './App.css';
import Bitcoin from './components/Bitcoin';
import Navbar from './layouts/Navbar';
import HalvingCountdown from './components/HalvingCountdown';
import CoinList from './components/CoinList';
import Grid1 from './layouts/Grid1';
import Grid2 from './layouts/Grid2';
import Grid3 from './layouts/Grid3';
//https://startatage30.tistory.com/29
//위에거를 일단 클론코딩하자. 코인종목 옆에 가격 실시간
//cors 이슈 해결해야
/*
1. 비트코인 가격데이터로 차트컴포넌트 만들기

2. CoinList컴포넌트로 옮기기
3. Coin컴포넌트 디자인 예쁘게
4. 소켓통신으로 그 블로그처럼 해보기
5. 인피니티 스크롤 + 페이지네이션?

어려우니 먼저 비트코인 컴포넌트부터 만들기로... 
object Blob이 먼지...? (gpt 답변)
 VM1750:1 Uncaught SyntaxError: Unexpected token 'o', "[object Blob]" is not valid JSON
    at JSON.parse (<anonymous>)
    at ws.onmessage (Bitcoin.tsx:21:39)
*/

function App() {
  const [btc, setBTC] = useState(null);

  useEffect(() => {
    //일 캔들 가져오기
    axios.get("https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200")
      .then(response => setBTC(response.data))
      .catch(err => console.log(err));
  }, []);
  // useEffect(() => {
  //   console.log("data:", markets);
  //   console.log("btc candle", btc);

  // }, [markets, btc])

  return (
    <>
      {/* <Chart /> */}
      <Navbar />
      <div className='flex h-screen'>
        <div className='flex flex-col w-8/12'>
          <Grid1 />
          <Grid3 />
        </div>
        <div className='flex w-4/12'>
          <Grid2 />
        </div>
      </div>
      <Bitcoin />
      <HalvingCountdown />
      {/* <CoinList /> */}
      {/* 괄호문제는 왜 안되는지 꼭확인할것
      syntax error input~
      SyntaxError: Unexpected end of input */}
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

