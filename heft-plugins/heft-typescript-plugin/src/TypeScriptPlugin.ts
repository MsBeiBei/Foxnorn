import { IHeftTaskPlugin } from "@rushstack/heft";
import ts from "typescript";

export default class TypeScriptPlugin implements IHeftTaskPlugin {
  public apply() {
    console.log(ts.sys);
  }
}
