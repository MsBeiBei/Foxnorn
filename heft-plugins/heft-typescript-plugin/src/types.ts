import type TTypescript from "typescript";


export interface IExtendedTypeScript {

}

export type ExtendedTypeScript = typeof TTypescript & IExtendedTypeScript;
