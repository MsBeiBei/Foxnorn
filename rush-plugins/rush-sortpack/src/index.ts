#!/usr/bin/env node

import { resolve } from "path";
import RushLib from "@microsoft/rush-lib";
import {CommandLineParser} from "@rushstack/ts-command-line";
import { sortpack } from "./sortpack.js";
import { getRushConfig } from "./helpers/getRushConfig.js";


export class WidgetCommandLine extends CommandLineParser {
  public constructor() {
    super({
      toolFilename: 'widget',
      toolDescription: 'The "widget" tool is a code sample for using the @rushstack/ts-command-line library.'
    });

    console.log(
      this)
  }


}


async function bootstrap(): Promise<void> {
  try {
    const commandLine = new WidgetCommandLine()
    console.log(process.env)
    commandLine.execute();

    const rushConfig: RushLib.RushConfiguration = getRushConfig();

    for (const project of rushConfig.projects) {
      const packageJsonFilePath: string = resolve(
        rushConfig.rushJsonFolder,
        project.projectFolder
      );

      sortpack(packageJsonFilePath);
    }
  } catch (e) {}
}

bootstrap();
