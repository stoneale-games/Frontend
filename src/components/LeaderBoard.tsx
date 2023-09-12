import Tile from "./Tile";
import cp from "../assets/cp.png";
import { friends } from "../utils/data/friends";

const LeaderBoard = () => {
    return <section className="w-64 p-5 bg-primary-blue-300 overflow-auto rounded-lg">
        <h2 className="text-center text-white-950 font-semibold">Leader board</h2>
        <ul className="flex flex-col gap-4 mt-4">
            {friends.map(({ name, imgSrc, cp }, index) => <LeaderBoardAvatar key={index} name={name} imgSrc={imgSrc} cpIndex={cp} index={index} />)}
        </ul>
    </section>
}

export default LeaderBoard;

const LeaderBoardAvatar = ({ imgSrc, name, cpIndex, index }: { imgSrc: string; name: string; cpIndex: string; index: number }) => {
    return <div className="relative flex gap-3 items-center">
        <img src={imgSrc} alt={name} className="h-12 rounded-full " />
        <div className="flex flex-col ">
            <h3 className="text-sm text-white-950">{name}</h3>
            <Tile img={{ src: cp, alt: name }} title={cpIndex} />
        </div>
        <div className="absolute">{index}</div>
    </div>
}