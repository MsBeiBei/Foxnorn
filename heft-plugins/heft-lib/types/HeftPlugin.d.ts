import type { IHeftTaskPlugin, IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
import { HeftLogger } from "./HeftLogger";
export declare abstract class HeftPlugin implements IHeftTaskPlugin {
    abstract readonly PLUGIN_NAME: string;
    protected heftLogger: HeftLogger;
    apply(taskSession: IHeftTaskSession, heftConfiguration: HeftConfiguration): void;
    run?(taskSession: IHeftTaskSession, heftConfiguration: HeftConfiguration): Promise<void>;
}
//# sourceMappingURL=HeftPlugin.d.ts.map