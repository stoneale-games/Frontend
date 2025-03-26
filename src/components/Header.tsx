import cart from "../assets/cart.png";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";
import { NavLink, useLocation } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useContext } from "react";
import { DisplayContext } from "../contexts/displays";
import { messages } from "../utils/data/messages";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ThemeToggle from "./ThemeToggle";

import Web3Auth from "./auth/Web3-auth";
import Logo from "./Logo";

const Header = ({ isConnected }: { isConnected: boolean }) => {
  return isConnected ? <IsConnectedHeader /> : <NotConnectedHeader />;
};

export default Header;

const IsConnectedHeader = () => {
  const location = useLocation();
  return (
    <header className="bg-primary-blue-300 h-14 w-full flex items-center justify-between px-12">
      <NavLink to="/">
   <Logo/>
      </NavLink>
      <div className="flex items-center gap-6">
        <MessageNav />
        {location.pathname === "/" && (
          <VolumeUpOutlinedIcon className="text-white-950 !text-md cursor-pointer" />
        )}
        {location.pathname !== "/wallet" && (
          <Brightness4OutlinedIcon className="text-white-950 !text-md cursor-pointer" />
        )}
        {location.pathname === "/" && (
          <NavLink to="/personal">
            <SettingsOutlinedIcon className="text-white-950 !text-md cursor-pointer" />
          </NavLink>
        )}
        <InfoOutlinedIcon className="text-white-950 !text-md cursor-pointer" />
        {location.pathname === "/" ? (
          <button className="flex gap-2 items-center bg-white-950 rounded-md text-accent-950 text-sm py-1.5 px-6">
            <img src={cart} alt="cart" className="h-6" />
            <span>Buy CP</span>
          </button>
        ) : (
          <NavLink to="/">
            <button className="flex gap-2 items-center bg-white-950 rounded-md text-accent-950 text-sm py-1.5 px-6">
              Back to Lobby
            </button>
          </NavLink>
        )}
      </div>
    </header>
  );
};

const NotConnectedHeader = () => {
  return (
    <header className=" h-14 w-full flex items-center justify-between px-12 z-10 relative">
      {/* <Brightness4OutlinedIcon className="text-secondary-950" /> */}

      <ThemeToggle />
      <Web3Auth />
    </header>
  );
};

const MessageNav = () => {
  const { displays, setDisplays } = useContext(DisplayContext);
  return (
    <div className="relative">
      <div
        onClick={(e) => {
          setDisplays((prevDisplays) => {
            return { ...prevDisplays, message: !prevDisplays.message };
          });
          e.stopPropagation();
        }}
      >
        <EmailOutlinedIcon className="text-white-950 !text-md cursor-pointer" />
      </div>
      {displays.message && (
        <div
          className="absolute flex flex-col p-3 gap-2 top-10 z-10 w-56 -left-24 ring-1 ring-accent-950  bg-secondary-950 h-fit rounded-md shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {messages.map((message, index) => {
            return (
              <article
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white-950 rounded-md" : "bg-transparent"
                } p-2 flex gap-2`}
              >
                <p className={` text-primary-600 text-sm`}>{message}</p>
                <CancelOutlinedIcon className="text-accent-950 !text-sm" />
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
