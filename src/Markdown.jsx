import { h } from "preact";
import { useEffect, useRef, useCallback } from "preact/hooks";
import snark from "snarkdown";

export default ({ content }) => {
  const ref = useCallback(node => {
    console.log("cb", node, content);
    if (node !== null) {
      node.innerHTML = snark(content);
    }
  }, []);
  return <div
    // dangerouslySetInnerHTML={{ __html: snark(markdown) }}
   ref={ref}
  ></div>;
};
