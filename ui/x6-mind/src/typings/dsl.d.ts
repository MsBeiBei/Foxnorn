export interface Port {
  id: string;
  name: string;
  label?: string;
}

export interface Node {
  id: string;
  name: string;
  label?: string;
  icon?: string;
  desc?: string;
  in?: Port[];
  out?: Port[];
}

export interface PointData {
  nodeId: string;
  portId?: string;
}

export interface Link {
  id: string;
  source: PointData;
  target: PointData;
}

export interface Meta {
  nodes: Node[];
  links: Link[];
}

export interface Schema {
  id: string;
  name: string;
  label?: string;
  meta?: Meta;
}
