import { defineComponent } from "vue";
import { useCells } from "@/hooks/useCells";

export const Logic = defineComponent({
  name: "Logic",
  setup(_props, { slots }) {
    useCells();

    return () => slots["default"]?.();
  },
});
