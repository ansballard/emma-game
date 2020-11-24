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
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      fontSize: "20px",
      transform: x && y ? `translate3d(${x}px, ${y}px, 0)` : null,
     }} data-x={x} data-y={y}>{children}</div>
  );
};
