import React, { useState } from 'react'

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen((prev) => !prev);
    }

    return (
        <div className='relative h-screen'>
            <button onClick={toggleDrawer}
                className='absolute top-4 left-4 bg-[#30d5c8] text-black p-2 rounded-full'>
                {isOpen ? "<<" : ">>"}
            </button>
            <aside className={`fixed top-0 right-0 w-64 h-full bg-white shadow-md
                transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 `}>
                <div className='p-4'>
                    <h2 className='text-xl font-bold'>관심 목록</h2>
                    <div className='flex flex-row'>
                        <div>즐겨찾기</div>
                        <div>최근 본</div>
                    </div>
                    <div>솔라나</div>
                    <div>온도 파이낸스</div>
                    <div>비트코인</div>
                </div>
            </aside>
        </div>
    )
}
