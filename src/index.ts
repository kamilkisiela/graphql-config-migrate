#!/usr/bin/env node

import meow from "meow";
import globby from "globby";
import chalk from "chalk";
import isGitClean from "is-git-clean";
import { readFileSync, writeFileSync } from "fs";
import { migrate } from "./migrate";

const cli = meow(
  `
Usage:      npx graphql-config-codemods [options]
Examples:   npx graphql-config-codemods
            npx graphql-config-codemods --dry
Options:
  -f, --force       Bypass Git safety checks and force migration to run
  -d, --dry         Dry run (no changes are made to files)`,
  {
    flags: {
      force: {
        type: "boolean",
        alias: "f",
      },
      dry: {
        type: "boolean",
        alias: "d",
      },
    },
  }
);

const flags = cli.flags;

async function main() {
  if (!flags.dry) {
    checkGitStatus(flags.force);
  }

  console.log(`Migrating`);

  const configPatterns = [
    "**/.graphqlconfig",
    "**/.graphqlconfig.json",
    "**/.graphqlconfig.yaml",
    "**/.graphqlconfig.yml",
  ];

  const filepaths = await globby(configPatterns, {
    cwd: process.cwd(),
    ignore: ["**/node_modules/**"],
  });

  filepaths.forEach((filepath) => {
    const code = migrate(
      readFileSync(filepath, {
        encoding: "utf-8",
      }),
      filepath
    );

    if (flags.dry) {
      console.log(code);
    } else {
      writeFileSync(filepath, code, {
        encoding: "utf-8",
      });
    }

    console.log(
      `\n${chalk.bgGreen(chalk.black(" Migrated "))} ${chalk.bold(filepath)}\n`
    );
  });
}

function checkGitStatus(force?: boolean) {
  let clean = false;
  let errorMessage = "Unable to determine if git directory is clean";
  try {
    clean = isGitClean.sync(process.cwd());
    errorMessage = "Git directory is not clean";
  } catch (err) {
    if (err && err.stderr && err.stderr.indexOf("Not a git repository") >= 0) {
      clean = true;
    }
  }

  if (!clean) {
    if (force) {
      console.log(`WARNING: ${errorMessage}. Forcibly continuing.\n`);
    } else {
      console.log(
        chalk.yellow(
          "\nBut before we continue, please stash or commit your git changes."
        )
      );
      console.log(
        "\nYou may use the --force flag to override this safety check."
      );
      process.exit(1);
    }
  }
}

main();
