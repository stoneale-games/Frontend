import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DisplayContext } from "../contexts/displays";
import { TDisplays } from "../utils/types";
import { GameProvider } from "../contexts/GameContext";

const ConnectedLayout = () => {
  const [displays, setDisplays] = useState<TDisplays>({
    message: false,
  });
  return (
    <DisplayContext.Provider value={{ displays, setDisplays }}>
        <GameProvider>
      <div onClick={() => setDisplays({ message: false })}>
        <Outlet />
      </div>
      </GameProvider>
    </DisplayContext.Provider>
  );
};

export default ConnectedLayout;
