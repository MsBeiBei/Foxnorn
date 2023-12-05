import {
  useSketchContext,
  type State as Store,
} from "@/context/useSketchContext";
import { type Node, type Link } from "@/typings/dsl";

export function useMetas() {
  const { useInject } = useSketchContext();
  const store: Store = useInject();

  const getMetas = () => ({
    links: store.links,
    nodes: store.nodes,
  });

  const updateMetas = ({ nodes, links }: { nodes: Node[]; links: Link[] }) => {
    store.nodes = nodes;
    store.links = links;
  };

  const clearMetas = () => {
    store.nodes = [];
    store.links = [];
  };

  return {
    getMetas,
    updateMetas,
    clearMetas,
  };
}
