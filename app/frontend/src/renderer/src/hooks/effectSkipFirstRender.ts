import { useEffect, useRef } from "react";

export default function useEffectSkipFirstRender(effect, deps) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    return effect();
  }, deps);
}