import './App.css';
import Navbar from './layouts/Navbar';
import { Theme } from './pages/Theme';
import { KimchiPremium } from './pages/KimchiPremium';
import { Routes, Route } from 'react-router-dom'
import { Mainpage } from './pages/Mainpage';
import { CoinDetail } from './pages/CoinDetail';

//import {Route} from "re"
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


  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <div className='flex-grow'>
          <Routes>
            <Route path='/' element={<Mainpage />} />
            <Route path="theme" element={<Theme />} />
            <Route path="kimchi-premium" element={<KimchiPremium />} />
            <Route path='/coin/:id' element={<CoinDetail />} />
          </Routes>
        </div>
      </div>


      {/* <div className='flex h-screen'>
        <div className='flex flex-col w-8/12'>
          <Grid1 />
          <Grid3 />
        </div>
        <div className='flex w-4/12'>
          <Grid2 />
        </div>
      </div>
      <Bitcoin />
      <HalvingCountdown /> */}
      {/* <CoinList /> */}
      {/* <Chart /> */}

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

