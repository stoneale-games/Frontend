import plug from "../assets/plug.png";
const BoardInfo = () => {
    return <div className="flex flex-col gap-2 w-64 ">
        <div className="flex items-center justify-end gap-2">
            <img src={plug} className="h-4" />
            <span className="text-xs text-white-950">Hi You have a fool house</span>
        </div>
        <div className="h-40 flex flex-col mt-4">
            <div className="bg-white-950 flex-1"></div>
            <button className="w-full h-10 rounded-md bg-primary-blue-300 text-white-950 text-sm">Ok</button>
        </div>
    </div>
}

export default BoardInfo