import { useRef } from "react";

export default function useScrollHeight() {
  const ref = useRef<HTMLDivElement>(null);
  return { ref };
}
