import RushLib from "@microsoft/rush-lib";
import { CWD } from "../constants.js";

export const localConfig = new Map<string, RushLib.RushConfiguration>();


export function getRushConfig(cwd: string = CWD): RushLib.RushConfiguration {
  if (localConfig.has(cwd)) {
    return localConfig.get(cwd) as RushLib.RushConfiguration;
  }

  console.log(cwd)

  const { RushConfiguration } = RushLib;

  if (!RushConfiguration) {
    throw new Error('load RushConfiguration from rush-sdk failed');
  }

  let rushConfiguration = RushLib.RushConfiguration.loadFromDefaultLocation({
    startingFolder: cwd,
  });

  if (!rushConfiguration) {
    throw new Error("RushConfiguration not found");
  }

  localConfig.set(cwd, rushConfiguration);

  return rushConfiguration;
}
