import { memo } from 'react'


export const Search = memo(() => {
    return (
        <div className="relative">

            <input type="search" placeholder="코인검색"
                className="w-full text-sm pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className='absolute top-1/2 transform -translate-y-1/2  left-3 text-gray-500'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                    className="w-5 h-5">
                    <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                </svg>

            </div>

        </div>
    )
})
