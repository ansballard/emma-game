import { h } from "preact";
import { useEffect, useState, useCallback } from "preact/hooks";

function useMouse(debounce = 10) {
  const [[x, y], setCoords] = useState([null, null]);
  const [wait, setWait] = useState(null);
  const listenForMouse = useCallback(({ clientX, clientY }) => {
    if(!wait && (clientX !== x || clientY !== y)) {
      setWait(setTimeout(() => {
        setWait(false);
      }, debounce));
      setCoords([clientX, clientY]);
    }
  });
  useEffect(() => {
    window.addEventListener("mousemove", listenForMouse);
    return () => {
      window.removeEventListener("mousemove", listenForMouse);
    };
  }, [listenForMouse]);
  return [[x, y]];
}

export const Fish = ({ children }) => {
  const [[x, y]] = useMouse();
  return (
    <div class="floaty-fish" style={{
      transform: x && y ? `translate3d(${x + 10}px, ${y}px, 0)` : `translateX(-100%)`,
     }}>{children}</div>
  );
};
