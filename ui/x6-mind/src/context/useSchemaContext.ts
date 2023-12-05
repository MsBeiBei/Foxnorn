import { ref } from "vue";
import { type Meta, type Node, type Link } from "@/typings/dsl";
import { useContext } from "@/hooks/useContext";

export interface Snapshot {
  nodes: Node[];
  links: Link[];
  selected?: string;
}

export interface State {
  modified: number;
  undoList: Snapshot[];
  redoList: Snapshot[];
  nodes: Node[];
  links: Link[];
  zoom: number;
  minimap: boolean;
  selected?: string;
}

export const state: State = {
  modified: 0,
  undoList: [],
  redoList: [],
  nodes: [],
  links: [],
  zoom: 1,
  minimap: false,
};

export const context = useContext<State>();

export function useSchemaContext() {
  const useProvide = () => {
    return context.useProvide(state);
  };

  return {
    useProvide,

  };
}
