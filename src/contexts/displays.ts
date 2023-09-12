import React from "react";
import { TDisplays } from "../utils/types";

export const DisplayContext = React.createContext<{
  displays: TDisplays;
  setDisplays: React.Dispatch<React.SetStateAction<TDisplays>>;
}>({
  displays: {
    message: false,
  },
  setDisplays: () => {},
});
