import Header from "../components/Header";
import ProfileBox from "../components/ProfileBox";
import avatar from "../assets/avatar.png";
import { navs } from "../utils/data/nav";
import NavCard from "../components/NavCard";
import FriendsList from "../components/FriendsList";
import LeaderBoard from "../components/LeaderBoard";
import WeeklyTable from "../components/WeeklyTable";
import { Link } from "react-router-dom";

const Lobby = () => {
  return (
    <div className="flex items-center justify-center h-screen">

      <Link to="/dashboard">
        <button className="rounded-full px-8 py-2 text-white-950 shadow-md bg-primary-blue-300">
          Start Game
        </button>
      </Link>
    </div>
  )
  // return (
  //   <div className="flex">
  //     <aside className="w-72 h-screen relative dark:bg-primary-blue-300 flex flex-col overflow-y-auto">
  //       <ProfileBox
  //         imgSrc={avatar}
  //         name="Zara"
  //         cpIndex="000005"
  //         starIndex="12"
  //       />
  //       <nav>
  //         <ul className="flex flex-col items-center gap-6 py-4">
  //           {navs.map(({ imgSrc, title, to }, index) => (
  //             <NavCard key={index} to={to} imgSrc={imgSrc} title={title} />
  //           ))}
  //         </ul>
  //       </nav>
  //     </aside>
  //     <section className="h-screen flex-1 flex py-4 px-12 flex-col">
  //       <Header isConnected={true} />
  //       <main className="flex flex-col flex-1 gap-4">
  //         <section className="flex-1 flex">
  //           <WeeklyTable />
  //           <LeaderBoard />
  //         </section>
  //         <FriendsList />
  //       </main>
  //     </section>
  //   </div>
  // );
};

export default Lobby;
