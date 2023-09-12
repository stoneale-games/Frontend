import zara from "../assets/avatar.png";
import dice from "../assets/dice.png";
import whiteStar from "../assets/white-star.png";
import speed from "../assets/speed.png";
import cp from "../assets/cp.png";
import rate from "../assets/rate.png";
import BoxCard from "../components/BoxCard";
import ProgressCard from "../components/ProgressCard";
import TopHand from "../components/TopHands";

const Personal = () => {
    return <div className="flex flex-col">
        <section className="bg-white-950 rounded-t-md h-36 flex justify-center items-center">
            <div className="flex w-fit gap-4">
                <img src={zara} className="h-24 aspect-square rounded-xl" />
                <div className="flex flex-col justify-between">
                    <h3 className="font-semibold text-xl">Zara</h3>
                    <div className="flex items-center gap-2">
                        <img src={cp} className="h-6 w-6" />
                        <h4 className="text-lg">00005</h4>
                    </div><div className="flex items-center gap-2">
                        <img src={rate} className="h-6 w-6" />
                        <h4 className="text-lg">15</h4>
                    </div>
                </div>
            </div >
        </section >
        <section className="flex justify-center overflow-auto max-h-[calc(100vh-200px)]">
            <section className="max-w-6xl py-8 px-8  flex-1 flex flex-col gap-4 overflow-auto">
                <div className="flex gap-12 w-full">
                    <BoxCard img={{ src: dice, alt: "dice" }} title="Games Played" value="101" />
                    <BoxCard img={{ src: whiteStar, alt: "star" }} title="Games Won" value="10" />
                    <BoxCard img={{ src: speed, alt: "speed" }} title="Total Hand Played" value="15" />
                </div>
                <ProgressCard title="Win" value="08" wgProgress={60} tgProgress={20} />
                <ProgressCard title="Played Time" value="357 Hr" wgProgress={30} tgProgress={80} />
                <div className="bg-primary-blue-300 flex flex-col gap-4 rounded-md shadow-xl px-8 py-4">
                    <div className="flex justify-between text-md text-white-950 border-b border-accent-950">
                        Top Hands
                    </div>
                    <div className="flex flex-col  gap-2 w-full overflow-auto">
                        {[1, 2, 3, 4].map((value) => <TopHand key={value} hasBackground={value % 2 === 0} noOfDays={value} />)}
                    </div>
                </div>
            </section>
        </section>
    </div >
}

export default Personal