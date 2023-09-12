import Board from "../components/Board"
import BoardActions from "../components/BoardActions"
import BoardInfo from "../components/BoardInfo"
import BoardMessage from "../components/BoardMessage"

const Dashboard = () => {
    return <section className="relative h-[calc(100vh-60px)]">
        <Board />
        <section className="absolute px-16 flex justify-between items-end bottom-6 left-0 right-0">
            <BoardMessage />
            <BoardActions />
            <BoardInfo />
        </section>
    </section>
}

export default Dashboard