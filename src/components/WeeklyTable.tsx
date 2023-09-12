import { Link } from "react-router-dom";
import { dashboardNav } from "../utils/data/nav"
import { tableData, tableHeader } from "../utils/data/table";

const WeeklyTable = () => {
    const activeIndex = 2;
    return <section className="flex flex-1 flex-col bg-primary-900 rounded-xl shadow-lg">
        <nav className="flex items-center h-14 justify-between px-4 bg-primary-blue-950 rounded-t-xl">
            {
                dashboardNav.map(({ title, action }, index) => <button key={index} onClick={action} className={`${activeIndex === index ? "bg-white-600 text-primary-blue-950" : "bg-transparent  text-white-950 ring-white-100 ring-1"}  rounded-md px-8 py-1.5 text-sm  `}>
                    {title}
                </button>)
            }
        </nav>
        <div className="flex-1 flex flex-col mx-4  overflow-auto max-h-[calc(100vh-370px)]">
            <div className="flex">
                {tableHeader.map((header, index) => <div key={index} className="border-b border-white-100 text-white-100 h-12 flex flex-1 items-center w-full">{header}</div>)}
            </div>
            <div className="flex-1 flex flex-col overflow-auto">
                {tableData.map(({ table, rate, game, players, avgStack }, index) => <div key={index} className="py-3 px-2 rounded-md flex items-center cursor-pointer hover:bg-primary-300">
                    <div className="text-sm font-ndivrmal text-white-950 flex-1">{table}</div>
                    <div className="text-sm font-normal text-secondary-950  flex-1">{rate}</div>
                    <div className="text-sm font-normal text-white-950  flex-1">{game}</div>
                    <div className="text-sm font-normal text-white-950  flex-1">{players}</div>
                    <div className="text-sm font-normal text-secondary-950 flex-1">{avgStack}</div>
                </div>)}
            </div>
        </div>
        <div className="h-10 flex items-center justify-center pt-6">
            <Link to="/dashboard"><button className="rounded-full px-8 py-2 text-white-950 shadow-md bg-primary-blue-300">Start Game</button></Link>
        </div>
    </section>
}

export default WeeklyTable

