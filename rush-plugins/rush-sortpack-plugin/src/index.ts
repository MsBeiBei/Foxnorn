#!/usr/bin/env node

import { resolve } from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import RushLib from "@microsoft/rush-lib";
import {
  ConsoleTerminalProvider,
  Terminal,
  Colors,
} from "@rushstack/node-core-library";
import { sortpack } from "./sortpack.js";
import { getRushConfig } from "./helpers/getRushConfig.js";

const terminal: Terminal = new Terminal(new ConsoleTerminalProvider());

interface Argv {
  filter?: string;
}

const argv = yargs(hideBin(process.argv)).argv as Argv;

async function bootstrap(): Promise<void> {
  try {
    const rushConfig: RushLib.RushConfiguration = getRushConfig();

    const getPackageJsonFilePath = (projectFolder: string): string =>
      resolve(rushConfig.rushJsonFolder, projectFolder);

    if (argv?.filter) {
      const project = rushConfig.projects.find(
        (project) => project.packageName === argv.filter
      ) as unknown as RushLib.RushConfigurationProject;

      if (!project) {
        throw new Error(
          `The project name "${argv.filter}" passed to "--filter" does not exist in rush.json.`
        );
      }

      const packageJsonFilePath = getPackageJsonFilePath(project.projectFolder);

      sortpack(packageJsonFilePath);

      terminal.writeLine(
        Colors.green(`Sort ${argv.filter}'s package.json successfully`)
      );
      return;
    }

    for (const project of rushConfig.projects) {
      const packageJsonFilePath = getPackageJsonFilePath(project.projectFolder);

      sortpack(packageJsonFilePath);
    }

    terminal.writeLine(Colors.green(`Sort all package.json successfully`));
  } catch (e: any) {
    if (e.message) {
      terminal.writeErrorLine(e.message);
    } else {
      throw e;
    }

    process.exit(1);
  }
}

bootstrap();
