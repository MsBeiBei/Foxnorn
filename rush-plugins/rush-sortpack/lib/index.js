#!/usr/bin/env node
import { resolve } from "path";
import RushLib from "@microsoft/rush-lib";
import { sortpack } from "./sortpack.js";
import { getRushConfig } from "./helpers/getRushConfig.js";
async function bootstrap() {
    try {
        const rushConfig = getRushConfig();
        for (const project of rushConfig.projects) {
            const packageJsonFilePath = resolve(rushConfig.rushJsonFolder, project.projectFolder);
            sortpack(packageJsonFilePath);
        }
    }
    catch (e) { }
}
bootstrap();
//# sourceMappingURL=index.js.map