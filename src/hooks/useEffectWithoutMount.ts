import { useEffect, useRef } from "react";

const useEffectWithoutMount = (callback: () => void, dependencies: any[]) => {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (!isFirstMount.current) {
      return callback();
    }

    isFirstMount.current = false;
  }, dependencies);
};

export default useEffectWithoutMount;
