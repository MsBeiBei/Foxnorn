import type {
  IHeftTaskPlugin,
  IHeftTaskSession,
  HeftConfiguration,
} from "@rushstack/heft";
import { HeftLogger } from "./HeftLogger";

export abstract class HeftPlugin implements IHeftTaskPlugin {
  abstract readonly PLUGIN_NAME: string;

  protected logger!: HeftLogger;

  apply(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): void {
    this.logger = new HeftLogger(taskSession.logger.terminal);

    if (this.run) {
      this.run(taskSession, heftConfiguration);
    }
  }

  run?(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<void>;
}
