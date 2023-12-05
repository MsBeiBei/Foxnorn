import {
  useSketchContext,
  type State as SketchState,
} from "@/context/useSketchContext";

export function useGraph() {
  const { useInject } = useSketchContext();

  const store: SketchState = useInject();

  return {
    store,
  };
}
