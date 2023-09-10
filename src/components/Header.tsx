import React from 'react';
import logo from "../assets/logo.png";
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';

const Header = () => {
    const isConnected = false;
    return isConnected ? <IsConnectedHeader /> : <NotConnectedHeader />;
}

export default Header;


const IsConnectedHeader = () => {
    return <header className='bg-primary-blue h-14 w-full flex items-center justify-between px-4'>
        <img src={logo} alt="crypto poker" className='h-10' />
    </header>
}

const NotConnectedHeader = () => {
    return <header className=' h-14 w-full flex items-center justify-between px-4'>
        <Brightness4OutlinedIcon className="text-secondary-950" />
        <button className="bg-primary-100 px-4 h-10 flex items-center border border-secondary-100 rounded-md text-secondary-100">Connect Wallet</button>
    </header>
}