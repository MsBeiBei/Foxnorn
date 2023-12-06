import { onBeforeUnmount } from "vue";
import { Graph } from "@antv/x6";
import { graphSetting } from "@/settings/graphSetting";

export function useCreateGraph() {
  let graph: Graph;

  const bind = (el: HTMLElement) => {
    graph = new Graph({
      ...graphSetting,
      container: el,
    });
  };

  onBeforeUnmount(() => {
    graph.dispose();
  });

  return {
    bind,
  };
}
