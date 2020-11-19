import "./index.css";

import { h, Fragment, render } from "preact";
import { useState } from "preact/hooks";

const Root = () => {
  const [circles, setCircles] = useState([{
    shiftRight: false,
    display: "Emma",
  }, {
    shiftRight: false,
    display: "Tyler",
  }]);
  const [square, setSquare] = useState({
    spinRight: false,
    shiftRight: false
  });

  function moveCircle(index, x) {
    setCircles((_circles) => {
      const circle = _circles[index];
      return [
        ..._circles.slice(0, index),
        { ...circle, shiftRight: !circle.shiftRight },
        ..._circles.slice(index + 1),
      ];
    });
  }
  function moveCircles() {
    circles.forEach((_, index) => {
      setTimeout(() => {
        moveCircle(index);
      }, index * 50);
    });
  }

  function moveSquare() {
    setSquare({
      ...square,
      shiftRight: !square.shiftRight,
    });
  }

  function spinSquare() {
    setSquare({
      ...square,
      spinRight: !square.spinRight,
    });
  }

  return <>
    <div class="blue-text">
      Hello World hjjyhhyjhjjh76j6h7j8jrjjjjjuyijjjij7y6t fgrd45yg7nmbs
      7hkjyg87guugyi
    </div>
    <button onClick={moveCircles}>Move that circle, button!</button>
    <button onClick={moveSquare}>Move that square, button!</button>
    <br />
    <br />
    <textarea style="width: 100vw; height: 100px;"></textarea>
    <br />
    <br />
    <div id="circle-wrapper">
      {
        circles.map(circle => (
          <div class={`shape circle blue${circle.shiftRight ? " shift-right" : ""}`}><div>{circle.display}</div></div>
        ))
      }
    </div>
    <br />
    <div class={`shape square green${square.spinRight ? " spin-right" : ""}${square.shiftRight ? " shift-right" : ""}`} onClick={spinSquare}></div>
  </>;
}

render(<Root />, document.querySelector("body"));
