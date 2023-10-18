import type { IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
import { HeftTypeScriptPlugin } from "./HeftTypeScriptPlugin";

export default class TypeScriptPlugin extends HeftTypeScriptPlugin {
  override async run(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ) {}
}
