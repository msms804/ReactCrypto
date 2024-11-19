import axios from 'axios';
import { useEffect, useState } from 'react'
import { IUpbitThemes } from '../typings/db';

export const Cointable = () => {
    const [themes, setThemes] = useState<IUpbitThemes[]>();
    const [selectedTheme, setSelectedTheme] = useState('ALL');

    useEffect(() => {
        const fetchUpbitThemes = async () => {
            try {
                const result = await axios.get('http://localhost:8080/api/theme')
                console.log("테마리스트", result.data);
                setThemes(result.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUpbitThemes();
    }, [])
    const handleThemeChange = (theme: string) => {
        console.log("누른테마는?", theme)
        setSelectedTheme(theme);
    }
    return (
        <div>
            <div className='flex flex-row space-x-2'>

                {themes?.map((item) =>
                    <div
                        onClick={() => { handleThemeChange(item.theme) }}
                        key={item.theme}
                        className={selectedTheme === item.theme ? `bg-slate-200` : ''}
                    >{item.name}</div>)}
            </div>
        </div>
    )
}
