import { Element } from "types/element.js";

export const ELEMENT_NAME: "element-delay" = "element-delay";

export default class Delay implements Element.Scheam {
  public readonly name: string = ELEMENT_NAME;

  public readonly label: string = "delay";

  public readonly type: Element.TypeEnum = Element.TypeEnum.FUNCTION;
}
