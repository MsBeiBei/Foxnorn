import { type Graph } from "@antv/x6";
import { useContext } from "@/hooks/useContext";

export type State = [Graph | undefined];

export const state: State = [undefined];

export const context = useContext<State>();

export function useGraphContext() {
  const useProvide = () => {
    return context.useProvide(state);
  };

  const useInject = () => {
    const [graph] = context.useInject();

    return graph;
  };

  return {
    useProvide,
    useInject,
  };
}
