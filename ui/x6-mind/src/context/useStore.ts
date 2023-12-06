import { type Node, type Link } from "@/typings/dsl";

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
  selected: string | undefined;
}

export const initialState: State = {
  modified: 0,
  undoList: [],
  redoList: [],
  nodes: [],
  links: [],
  zoom: 1,
  minimap: false,
  selected: undefined,
};
