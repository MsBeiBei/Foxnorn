#!/usr/bin/env node

import { resolve } from "path";
import RushLib from "@microsoft/rush-lib";
import { sortpack } from "./sortpack.js";
import { getRushConfig } from "./helpers/getRushConfig.js";

async function bootstrap(): Promise<void> {
  try {
    const rushConfig: RushLib.RushConfiguration = getRushConfig();

    for (const project of rushConfig.projects) {
      const packageJsonFilePath: string = resolve(
        rushConfig.rushJsonFolder,
        project.projectFolder
      );

      console.log(project.projectFolder)

      sortpack(packageJsonFilePath);
    }
  } catch (e) {}
}

bootstrap();
