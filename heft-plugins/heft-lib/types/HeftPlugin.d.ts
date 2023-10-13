import type { IHeftTaskPlugin, IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
export declare abstract class HeftPlugin implements IHeftTaskPlugin {
    abstract readonly PLUGIN_NAME: string;
    run?(taskSession: IHeftTaskSession, heftConfiguration: HeftConfiguration): Promise<void>;
    apply(taskSession: IHeftTaskSession, heftConfiguration: HeftConfiguration): void;
}
//# sourceMappingURL=HeftPlugin.d.ts.map