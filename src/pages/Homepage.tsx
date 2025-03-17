import table from "../assets/table.png";
import play from "../assets/play.png";
import poker from "../assets/poker.png";
import game from "../assets/game.png";
import StarCard from "../components/StarCard";
import { useTheme } from "../contexts/ThemeContext";

const Homepage = () => {
  const { isDarkMode } = useTheme();
  return (
    <main>
      <section className="flex justify-center w-full">
        {/* <div className="flex flex-col items-center dark:text-secondary-950">
          <div className="flex gap-1 items-center text-6xl">
            <span>CRYPT</span>
            <img src={table} alt="table chips" className="h-12" />
          </div>
          <span className="text-5xl">Poker</span>
          <span className="text-xl">Play crypto</span>
        </div> */}
        {isDarkMode ? (
          <img src={"/dark-logo.png"} />
        ) : (
          <img src={"/light-logo.png"} />
        )}
      </section>
      <section className="absolute bottom-10 flex gap-20 justify-center left-0 right-0">
        <StarCard
          imgSrc={play}
          mainRotation="-rotate-[30deg]"
          dummyRotation="-rotate-12"
          size="small"
          title="Play"
          subtitle="Demo"
        />
        <StarCard
          imgSrc={poker}
          mainRotation="bottom-24"
          dummyRotation="-rotate-12"
          size="big"
          title="Play"
          subtitle="Poker"
        />
        <StarCard
          imgSrc={game}
          mainRotation="rotate-[30deg]"
          dummyRotation=""
          size="small"
          title="Upcoming"
          subtitle="Game"
        />
      </section>
    </main>
  );
};

export default Homepage;
