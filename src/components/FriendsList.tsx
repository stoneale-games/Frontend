import Tile from "./Tile";
import cp from "../assets/cp.png";
import { friends } from "../utils/data/friends";

const FriendsList = () => {
    return <section className="flex gap-12 items-center bg-primary-blue-300 rounded-xl p-4">
        <div className="flex flex-col gap-6 justify-between items-center">
            <h3 className="text-white-950">Friend List</h3>
            <div className="flex flex-col gap-2">
                <button className="bg-transparent ring-1 rounded-md px-8 py-1.5 text-sm text-white-950  ring-white-100 ">Invite Friends</button>
                <button className="bg-transparent ring-1 rounded-md px-8 py-1.5 text-sm text-white-950  ring-white-100 ">Friend's Chat</button>
            </div>
        </div>
        <ul className="flex flex-1 gap-12  overflow-auto">
            {
                friends.map(({ name, imgSrc, cp, online }, index) => <FriendAvatar key={index} name={name} imgSrc={imgSrc} cpIndex={cp} online={online} />)
            }
        </ul>
    </section>
}

export default FriendsList;

const FriendAvatar = ({ name, imgSrc, cpIndex, online }: { name: string; imgSrc: string, cpIndex: string; online: boolean }) => {
    return <div className="relative flex flex-col items-center gap-2">
        <h3 className="text-sm font-semibold text-white-950">{name}</h3>
        <img src={imgSrc} alt={name} className="h-12 rounded-full" />
        <Tile img={{ src: cp, alt: name }} title={cpIndex} />
        {online && <div></div>}
    </div>
}