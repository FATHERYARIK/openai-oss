#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { Command } from "commander";
import {
  createClient,
  draftReleaseNotes,
  summarizePullRequest,
  triageIssue,
} from "./index.js";

const program = new Command();

program
  .name("openai-oss")
  .description("CLI toolkit for open-source maintainers")
  .version("0.1.0");

program
  .command("triage")
  .description("Triage a GitHub issue from title and body")
  .requiredOption("--title <title>", "Issue title")
  .option("--body <body>", "Issue body", "")
  .option("--body-file <path>", "Read issue body from a file")
  .action(async (options) => {
    const body = options.bodyFile ? readFileSync(options.bodyFile, "utf8") : options.body;
    const client = createClient();
    const result = await triageIssue(client, { title: options.title, body });
    console.log(result);
  });

program
  .command("pr-summary")
  .description("Summarize a pull request from metadata and diff")
  .requiredOption("--title <title>", "PR title")
  .option("--body <body>", "PR description", "")
  .requiredOption("--diff-file <path>", "Path to unified diff")
  .action(async (options) => {
    const diff = readFileSync(options.diffFile, "utf8");
    const client = createClient();
    const result = await summarizePullRequest(client, {
      title: options.title,
      body: options.body,
      diff,
    });
    console.log(result);
  });

program
  .command("release-notes")
  .description("Draft release notes from a list of commits")
  .requiredOption("--version <version>", "Target version, e.g. v1.2.0")
  .requiredOption("--commits-file <path>", "File with one commit message per line")
  .action(async (options) => {
    const commits = readFileSync(options.commitsFile, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const client = createClient();
    const result = await draftReleaseNotes(client, {
      version: options.version,
      commits,
    });
    console.log(result);
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});
