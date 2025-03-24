import Header from "./components/Header";
import ConnectedLayout from "./layouts/ConnectedLayout";
import "./output.css";
import Homepage from "./pages/Homepage";
import vector from "./assets/vector.png";
import playVector from "./assets/play_vector.png";
import card1 from "./assets/card1.png";
import card2 from "./assets/card2.png";
import { useLocation } from "react-router-dom";
import { useTheme } from "./contexts/ThemeContext";
import useAuthStore from "./store/authStore";

function App() {
  //const { isConnected } = useAccount();
  const token = useAuthStore((state: any) => state.token);
  const isConnected = !token;
  const location = useLocation();
  const { isDarkMode } = useTheme();
  return (
    <div className="dark:bg-primary-950 bg-white-background w-screen h-screen overflow-hidden">
      {!isConnected && (
        <section className="absolute top-0 bottom-0 right-0 left-0">
          <div className="flex justify-center w-full h-screen">
            <img
              src={isDarkMode ? vector : "/Vector-light.svg"}
              alt="vector"
              className="h-[70%]"
            />
          </div>
          <div className="absolute bottom-0 h-[40%]  left-0 right-0 flex justify-center">
            <img src={playVector} alt="play" className="h-full" />
          </div>
          <div className="absolute left-0 right-0 bottom-0 top-0">
            <img
              src={card1}
              alt="card"
              className="absolute left-[50%] top-12"
            />
            <img src={card1} alt="card" className="absolute left-10 top-28" />
            <img src={card2} alt="card" className="absolute right-10 top-28" />
            <img
              src={card1}
              alt="card"
              className="absolute right-20 bottom-28"
            />
            <img
              src={card2}
              alt="card"
              className="absolute -left-28 bottom-14"
            />
          </div>
        </section>
      )}
      {/* Show this kind of header when its not connected or when not on dashboard */}
      {(!isConnected || location.pathname !== "/") && (
        <Header isConnected={isConnected} />
      )}
      {isConnected ? <ConnectedLayout /> : <Homepage />}
    </div>
  );
}

export default App;
