import plug from "../assets/plug.png"; 
import pad from "../assets/pad.png";
const ProgressCard = ({ title, value, wgProgress, tgProgress }: { title: string; value: string; wgProgress: number; tgProgress: number }) => {
    return <div className="bg-primary-blue-300 flex flex-col gap-4 rounded-md shadow-xl px-8 py-4">
        <div className="flex justify-between border-b border-accent-950">
            <span className="text-md text-white-950">{title}</span>
            <span className="text-md text-white-950">{value}</span>
        </div>
        <div className="flex items-center mt-4">
            <div className="flex items-center gap-2 w-64">
                <img src={pad} className="w-6" alt="plug" />
                <h3 className="text-white-950 text-sm">Weekly Games</h3>
            </div>
            <progress className="flex-1" value={wgProgress} max={100} />
        </div>
        <div className="flex items-center">
            <div className="flex items-center gap-2 w-64">
                <img src={plug} className="w-6" alt="plug" />
                <h3 className="text-white-950 text-sm">Tournamnet Games</h3>
            </div>
            <progress className="flex-1" value={tgProgress} max={100} />
        </div>
    </div>
}

export default ProgressCard