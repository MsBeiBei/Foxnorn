import { type Graph } from "@antv/x6";
import { useContext } from "@/hooks/useContext";

export type State = [Graph | undefined];

export const state: State = [undefined];

export const context = useContext<State>();

export function useGraphContext() {
  const useProvide = context.useProvide(state)

  const useInject = context.useInject

  return {
    useProvide,
    useInject,
  };
}
