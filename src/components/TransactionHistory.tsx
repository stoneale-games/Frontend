import { transactions } from "../utils/data/friends"

const TransactionHistory = () => {
    return <section className="bg-primary-blue-300   h-screen min-h-[300px] flex flex-col gap-4 rounded-md shadow-xl px-8 py-4">
        <div className="flex justify-between text-md text-white-950 border-b border-accent-950">
            Transaction History
        </div>
        <div className="flex flex-col gap-6 w-full overflow-auto">
            {transactions.map(({ imgSrc, name, amount, title, status, time }, index) => <div key={index} className="flex items-center bg-white-950 rounded-md px-6 py-2 justify-between">
                <div className="flex items-center gap-2 flex-1">
                    <img src={imgSrc} alt={name} className="h-12 w-12" />
                    <div className="flex flex-col justify-start items-start">
                        <h3 className="text-sm text-primary-950">{name}</h3>
                        <div className="text-accent-950 text-xs">{time}</div>
                    </div>
                </div>
                <div className=" text-accent-950 flex-1">
                    {title}
                </div>
                <div className="text-accent-950 flex-1">${amount}</div>
                <button className={`${status === "Pending" ? "bg-accent-100/30 text-accent-950" : (status === "Failed" ? "bg-transparent text-primary-600 ring-1 ring-accent-600" : "bg-accent-950 text-white-950")} text-sm w-44 py-2 rounded-md`}>{status}</button>
            </div>)}
        </div>
    </section>
}

export default TransactionHistory