import { messages } from "../utils/data/messages"
import avatar from "../assets/avatar.png";
const BoardMessage = () => {
    return <div className="w-64 rounded-md h-72 flex-col flex shadow-lg bg-primary-blue-300">
        <ul className="flex-1 flex flex-col gap-4 overflow-auto">
            {
                messages.map((msg, index) => <li key={index}>
                    <article className="flex items-center gap-2 px-2">
                        <img src={avatar} alt="alt" className="h-6  rounded-full" />
                        <p className="p-2 rounded-md text-xs shadow-2xl text-white-300 ">{msg}</p>
                    </article>
                </li>)
            }
        </ul>
        <input className="w-full h-12 rounded-lg" placeholder="Send a message" />
    </div>
}

export default BoardMessage