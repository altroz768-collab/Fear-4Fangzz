import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";

interface AnimatedCounterProps {
  value: number;
}

export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = value;
    
    if (from === to) {
      return;
    }
    
    const controls = animate(from, to, {
      duration: 0.5,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplayValue(Math.floor(latest));
      },
      onComplete() {
        prevValueRef.current = to;
      }
    });

    return () => controls.stop();
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}
