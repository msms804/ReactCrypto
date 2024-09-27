import { Link } from "react-router-dom";
import { WatchListModal } from "../components/WatchListModal";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [darkmode, setDarkmode] = useState(() => {
        //로컬스토리지에서 값 불러오기 (없으면 기본값 false 사용)
        const savedMode = localStorage.getItem('darkmode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const handleDarkMode = () => {
        setDarkmode((prev: boolean) => !prev);
    }
    useEffect(() => {
        if (darkmode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem('darkmode', JSON.stringify(darkmode));
    }, [darkmode])

    return (<>
        <nav className="dark:bg-gray-900 dark:text-white border border-b-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {/* 로고 또는 사이트 이름 */}
                            <Link to='/' className="font-bold">minbit</Link>
                        </div>
                        {/* <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to='/theme' className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">테마</Link>
                                <Link to='/kimchi-premium' className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">김프</Link>
                            </div>
                        </div> */}
                    </div>
                    {/* 추가적인 네비게이션 요소, 예를 들면 로그인 버튼 */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-8 text-sm">
                            <WatchListModal />
                            <div onClick={handleDarkMode}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {darkmode
                                        ? <path
                                            fill="currentColor"
                                            d="M12 3.75a.75.75 0 00.75-.75v-.75a.75.75 0 10-1.5 0V3a.75.75 0 00.75.75zM12 20.25a.75.75 0 00-.75.75v.75a.75.75 0 101.5 0V21a.75.75 0 00-.75-.75zM21.75 11.25H21a.75.75 0 100 1.5h.75a.75.75 0 100-1.5zM3 11.25h-.75a.75.75 0 100 1.5H3a.75.75 0 100-1.5zM18.369 4.575l-.53.53a.75.75 0 101.06 1.06l.53-.529a.75.75 0 10-1.06-1.061zM5.11 17.834l-.53.53a.75.75 0 101.06 1.061l.53-.53a.75.75 0 10-1.06-1.061zM18.896 17.834a.75.75 0 00-1.06 1.06l.53.531a.75.75 0 101.061-1.061l-.531-.53zM5.11 6.167a.75.75 0 001.06-1.061l-.53-.531a.75.75 0 10-1.06 1.061l.53.53zM18.526 13.112a.75.75 0 00-.75-.182 5.19 5.19 0 01-1.554.231 5.389 5.389 0 01-5.384-5.383 5.186 5.186 0 01.233-1.553.75.75 0 00-.931-.943 6.882 6.882 0 108.58 8.58.75.75 0 00-.194-.75z">
                                        </path>
                                        :
                                        <svg width="22" height="22" fill="none" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 11.004a6 6 0 11-12 0 6 6 0 0112 0z" fill="currentColor"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11 .254a.75.75 0 01.75.75v1a.75.75 0 11-1.5 0v-1a.75.75 0 01.75-.75zM3.399 3.403a.75.75 0 011.06 0l.393.392a.75.75 0 01-1.06 1.06l-.393-.392a.75.75 0 010-1.06zm15.202 0a.75.75 0 010 1.06l-.393.393a.75.75 0 01-1.06-1.06l.393-.393a.75.75 0 011.06 0zM.25 11.003a.75.75 0 01.75-.75h1a.75.75 0 110 1.5H1a.75.75 0 01-.75-.75zm19 0a.75.75 0 01.75-.75h1a.75.75 0 110 1.5h-1a.75.75 0 01-.75-.75zm-2.102 6.149a.75.75 0 011.06 0l.393.393a.75.75 0 11-1.06 1.06l-.393-.393a.75.75 0 010-1.06zm-12.296 0a.75.75 0 010 1.06l-.393.393a.75.75 0 11-1.06-1.06l.392-.393a.75.75 0 011.06 0zM11 19.254a.75.75 0 01.75.75v1a.75.75 0 11-1.5 0v-1a.75.75 0 01.75-.75z" fill="currentColor">
                                            </path>
                                        </svg>}
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </>)
}
export default Navbar;