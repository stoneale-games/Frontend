import zara from "../assets/avatar.png";
import cp from "../assets/cp2.png";
import BoxCard from "../components/BoxCard";
import whiteStar from "../assets/white-star.png";
import speed from "../assets/speed.png";
import TransactionHistory from "../components/TransactionHistory";
const Wallet = () => {
    return <div className="flex flex-col">
        <section className="bg-white-950 rounded-t-md h-36 flex justify-center items-center">
            <div className="flex w-fit gap-4 items-center">
                <img src={zara} className="h-24 aspect-square rounded-xl" />
                <h3 className="font-semibold text-xl">Zara</h3>
            </div >
        </section >
        <section className="flex justify-center overflow-auto max-h-[calc(100vh-200px)]">
            <section className="max-w-6xl py-8 px-8  flex-1 flex flex-col gap-4 overflow-auto">
                <div className="flex gap-12 w-full">
                    <BoxCard img={{ src: cp, alt: "cp" }} title="Games Played" value="10cp" />
                    <BoxCard img={{ src: whiteStar, alt: "star" }} title="Tokens" value="10" />
                    <BoxCard img={{ src: speed, alt: "speed" }} title="NFTs" value="15" />
                </div>
                <button className="w-full py-5 my-4 rounded-full bg-primary-blue-300 text-secondary-600 text-lg shadow-lg">
                    Buy CP
                </button>
                <TransactionHistory />
            </section>
        </section>
    </div >
}

export default Wallet