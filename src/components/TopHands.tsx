import card from "../assets/card.png"; import rate from "../assets/rate.png";
const TopHand = ({ hasBackground, noOfDays }: { hasBackground: boolean; noOfDays: number }) => {
    return <div className={`${hasBackground ? "bg-white-950 rounded-md" : "bg-transparent"} p-4 flex items-center`}>
        <div className="flex overflow-auto flex-1 items-center gap-2">
            {[1, 2, 3, 4].map((value) => <img key={value} src={card} alt="card" />)}
            <img src={rate} alt="rate" />
        </div>
        <button className="bg-secondary-950 px-6 py-1 text-accent-950 text-sm rounded-md mx-4">{`${noOfDays} days ago`}</button>
    </div>
}

export default TopHand