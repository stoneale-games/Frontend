import {createFileRoute, useNavigate} from '@tanstack/react-router'
import lineCircle from "@/assets/vector.png";
import {PlayCard} from "@/components/pages/home/PlayCard";
import poker from "@/assets/poker.png";
import playCrypto from "@/assets/play_vector.png";
import upcomingGames from "@/assets/upcomming_games.png";
import playDemo from "@/assets/play_demo.png";
import {Logo} from "@/components/Logo.tsx";
import {ConnectWallet} from "@/components/modals/ConnectWallet.tsx";

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const navigate = useNavigate();


    return (


       <>
           <nav className="flex justify-end w-full absolute z-50">

               {/* <ExampleConnectButton/>*/}

               <ConnectWallet/>


           </nav>
           <main className="mx-auto">
               <div className="relative flex justify-center items-center w-full">
                   {/* Background Image */}
                   <img src={lineCircle} fetchPriority={"high"}   alt="background_vector" />
                   <Logo />
                   <div className={"absolute -bottom-80"}>
                       <img src={playCrypto} fetchPriority={"high"} alt="play_crypto" width={900} height={700} />
                   </div>
                   <div className={"absolute flex -bottom-32 gap-32"}>
                       <div className={"-rotate-12"}>
                           <PlayCard image={playDemo} text={"Play Demo"} onClick={() => {
                               navigate({ to: "/app/lobby" });
                           }} />
                       </div>
                       <div>
                           <PlayCard image={poker} text={"Play Poker"} onClick={() => {
                               navigate({ to: "/app/lobby" });
                           }} />
                       </div>
                       <div className={"rotate-12"}>
                           <PlayCard image={upcomingGames} text={"Upcoming Games"} onClick={() => navigate({ to: "/app/lobby" })} />
                       </div>
                   </div>
               </div>
           </main>
       </>
    );
}