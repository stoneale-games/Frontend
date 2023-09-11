import { NavLink } from "react-router-dom";

const NavCard = ({ imgSrc, title, to }: { imgSrc: string; title: string, to: string }) => {
    return <NavLink to={to}>
        <div className="flex flex-col gap-4 items-center cursor-pointer">
            <div className="rounded-2xl shadow-xl p-2 w-20 flex justify-center">
                <img src={imgSrc} alt={title} className="w-12" />
            </div>
            <div className="text-white-300 text-sm">{title}</div>
        </div>
    </NavLink>
}

export default NavCard