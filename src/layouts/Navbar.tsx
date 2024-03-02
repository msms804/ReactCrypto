import React from "react";

const Navbar = () => {

    return (<>
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {/* 로고 또는 사이트 이름 */}
                            <span className="text-white">Logo</span>
                        </div>
                        <div className="hidden md:block">
                            {/* 네비게이션 링크들 */}
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">시황</a>
                                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">BitCoin</a>
                            </div>
                        </div>
                    </div>
                    {/* 추가적인 네비게이션 요소, 예를 들면 로그인 버튼 */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <button className="bg-white text-gray px-3 py-2 rounded-md text-sm font-medium">bitcoin</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </>)
}
export default Navbar;