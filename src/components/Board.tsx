import board from "../assets/board.png";
import card from "../assets/card.png";
const Board = () => {
    return <section className="h-80 min-h-[400px] py-8 flex justify-center">
        <div className="h-72 w-[560px] relative ">
            <img src={board} className="absolute" />
            <ul className="flex gap-2 w-fit absolute top-40 left-[200px]">
                {[1, 2, 3, 4, 5].map((value, index) => <li key={index}>
                    <div className="ring-1 bg-transparent flex items-center justify-center ring-secondary-950 w-8 h-12 rounded-sm ">
                        {value < 4 && <img src={card} />}
                    </div>
                </li>)}
            </ul>
        </div>
    </section>
}

export default Board