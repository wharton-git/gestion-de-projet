import React, { useState } from 'react'
import Theme from '../components/setting/Theme';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Setting = () => {

    const [content, setContent] = useState("theme")

    const handleSwitch = (section) => {
        setContent(section);
    }

    return (
        <div className='flex w-screen pt-20 pb-10 px-5 h-screen'>
            <div className='flex flex-col justify-between h-full w-40 bg-base-200 rounded-2xl p-2'>
                <div className='flex flex-col'>
                    <div onClick={() => handleSwitch("theme")} className='btn bg-base-100 w-full'>
                        Themes
                    </div>
                </div>
                <div className='flex justify-center'>
                    <Link to='/' className='btn btn-ghost'>
                    <Home/>
                    </Link>
                </div>
            </div>
            <div className='divider divider-horizontal'></div>
            <div className='w-full'>
                {(content === "theme") && <Theme title={"Theme"} />}
            </div>
        </div>
    )
}

export default Setting