import { useGraphContext } from "@/context/useGraphContext";

export function useNode() {
  const { useInject } = useGraphContext();

  useInject();
}
