import CancelOutlined from "@mui/icons-material/CancelOutlined"
import { useState } from "react"


const BoardActions = () => {
    const [value, setValue] = useState(60);
    return <div className="w-72 flex flex-col items-center gap-4  h-fit ">
        <div className="px-2 py-0.5 rounded-md shadow-md text-white-950 bg-primary-blue-300 text-xs">173</div>
        <div className="flex w-full gap-2 items-center p-2 ring-1 ring-primary-900 rounded-md">
            <div className="text-xs text-white-300">Put</div>
            <input type="range" min={1} max={100} value={value} onChange={(e) => setValue(parseFloat(e.target.value))} className="flex-1 bg-primary-blue-300" />
            <div className="text-xs text-white-300">All in</div>
        </div>
        <div className="mt-6 flex w-full gap-2">
            <button className="bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center">
                <CancelOutlined className="!text-white-950" />
                <span className="text-xs text-white-950">Fold</span>
            </button>
            <button className="bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center">
                <CancelOutlined className="!text-white-950 !text-md" />
                <span className="text-xs text-white-950">Check</span>
            </button>
            <button className="bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center">
                <CancelOutlined className="!text-white-950" />
                <span className="text-xs text-white-950">Raise</span>
            </button>
        </div>
    </div>
}

export default BoardActions