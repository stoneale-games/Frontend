import { useState } from 'react';
import { Outlet } from "react-router-dom";
import { DisplayContext } from '../contexts/displays';
import { TDisplays } from '../utils/types';

const ConnectedLayout = () => {
    const [displays, setDisplays] = useState<TDisplays>({
        message: false
    })
    return <DisplayContext.Provider value={{ displays, setDisplays }}>
        <div onClick={() => setDisplays({ message: false })}>
            <Outlet />
        </div>
    </DisplayContext.Provider>
}

export default ConnectedLayout