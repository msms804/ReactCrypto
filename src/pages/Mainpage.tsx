import CoinList from '../components/CoinList'
import { FearGreed } from '../components/FearGreed'
import { BtcDominance } from '../components/BtcDominance'
import { Carousel } from '../components/Carousel'
import { TrendingTheme } from '../components/TrendingTheme'
import { Link } from 'react-router-dom'

export const Mainpage = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <div className="container mx-auto px-16 lg:px-32 ">
                {/* <div className='mt-10'>
                    <Carousel />
                </div> */}
                <div className="flex justify-between mt-10 space-x-4">
                    <div className="trending border border-slate-200 bg-white p-4 rounded-lg flex-1">
                        <h2 className="text-lg font-semibold mb-4">Bitcoin / TetherUS<span className='text-xs font-thin ml-2'>BTCUSDT</span></h2>
                        {/* Content for trending */}
                        <BtcDominance />
                    </div>
                    <div className="accounts border border-slate-200 bg-white p-4 rounded-lg flex-1">
                        <div className='flex flex-row items-center '>
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "var(--color-text)" }}><g clip-path="url(#clip0_4563_4366)"><path d="M19.7675 8.29504L17.1633 10.8992" stroke="currentColor" stroke-width="1.875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 12.5V16.25" stroke="currentColor" stroke-width="1.875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><g mask="url(#mask0_4563_4366)"><path d="M4.6875 16.25H0.9375C0.9375 10.0368 5.78681 5 12 5C18.2132 5 23.0625 10.0368 23.0625 16.25H19.3125" stroke="currentColor" stroke-width="1.875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.23242 8.29504L6.83661 10.8992" stroke="currentColor" stroke-width="1.875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 5V8.75" stroke="currentColor" stroke-width="1.875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.6875 16.25C4.6875 12.1078 7.85784 8.75 12 8.75C16.1422 8.75 19.3125 12.1078 19.3125 16.25" stroke="currentColor" stroke-width="1.875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.875 18.125C13.875 19.1605 13.0355 20 12 20C10.9645 20 10.125 19.1605 10.125 18.125C10.125 17.0894 10.9645 16.25 12 16.25C13.0355 16.25 13.875 17.0894 13.875 18.125Z" stroke="currentColor" stroke-width="1.875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></g></g><defs><clipPath id="clip0_4563_4366"><rect width="24" height="24" fill="currentColor" transform="translate(0 0.5)"></rect></clipPath></defs></svg>
                            <h2 className="text-lg font-semibold mb-4">
                                공포탐욕지수</h2>
                        </div>
                        {/* Content for accounts */}
                        <FearGreed />

                    </div>
                    <div className="trending border border-slate-200 bg-white p-4 rounded-lg flex-1">

                        <div className='flex flex-col h-full'> {/* h-full 추가 */}
                            <div className='flex flex-row justify-between items-center'>
                                <div className='flex flex-row items-center space-x-2'>{/* items-center 추가 */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 align-middle mb-4" >
                                        <path fillRule="evenodd" d="M9.808 4.057a.75.75 0 0 1 .92-.527l3.116.849a.75.75 0 0 1 .528.915l-.823 3.121a.75.75 0 0 1-1.45-.382l.337-1.281a23.484 23.484 0 0 0-3.609 3.056.75.75 0 0 1-1.07.01L6 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.061l4.25-4.25a.75.75 0 0 1 1.06 0l1.756 1.755a25.015 25.015 0 0 1 3.508-2.85l-1.46-.398a.75.75 0 0 1-.526-.92Z" clipRule="evenodd" />
                                    </svg>
                                    <h2 className="text-lg font-semibold mb-4">지금뜨는테마 TOP3</h2>
                                </div>
                                <Link to="/theme" className=' flex flex-row text-blue-600 text-xs'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                        <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                                    </svg>
                                    <div>자세히보기</div>
                                </Link>
                            </div>
                            <TrendingTheme />

                        </div>
                    </div>
                </div>
                <div>
                    <h2 className='my-4'>코인리스트</h2>
                    <CoinList />
                </div>
            </div>
            <div className='container flex flex-col items-center flex-grow bg-white'>
                <footer className='bg-gray-200 w-full p-4 mt-auto'>footer
                    <div>made by minsung</div>
                </footer>
            </div>
        </div>
    )
}
