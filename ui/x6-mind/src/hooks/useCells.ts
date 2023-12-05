import { type Meta, type Link, type Node } from "@/typings/dsl";
import { useGraphContext } from "@/context/useGraphContext";

export function useCells() {
  const { useInject } = useGraphContext();

  const graph = useInject();
}

export function getMetas(meta?: Meta) {
  if (!meta) return [];

  const metas: Array<Link | Node> = [...meta.links, ...meta.nodes];

  return metas;
}
