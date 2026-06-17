import OpenAI from "openai";

export type MaintainerTask = "triage" | "pr-summary" | "release-notes";

export interface MaintainerKitOptions {
  apiKey?: string;
  model?: string;
}

export function createClient(options: MaintainerKitOptions = {}): OpenAI {
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required. Set it in your environment or pass apiKey.");
  }

  return new OpenAI({ apiKey });
}

export async function triageIssue(
  client: OpenAI,
  issue: { title: string; body: string },
  model = "gpt-4o-mini"
): Promise<string> {
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are an open-source maintainer assistant. Classify the issue, suggest labels, priority, and a short first response for the reporter. Be concise and actionable.",
      },
      {
        role: "user",
        content: `Title: ${issue.title}\n\nBody:\n${issue.body || "(empty)"}`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "No response generated.";
}

export async function summarizePullRequest(
  client: OpenAI,
  pr: { title: string; body: string; diff: string },
  model = "gpt-4o-mini"
): Promise<string> {
  const trimmedDiff = pr.diff.length > 12000 ? `${pr.diff.slice(0, 12000)}\n\n[diff truncated]` : pr.diff;

  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are reviewing a pull request for an open-source project. Summarize intent, risks, test gaps, and give a maintainer recommendation (approve, request changes, or needs discussion).",
      },
      {
        role: "user",
        content: `Title: ${pr.title}\n\nDescription:\n${pr.body || "(empty)"}\n\nDiff:\n${trimmedDiff}`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "No response generated.";
}

export async function draftReleaseNotes(
  client: OpenAI,
  input: { version: string; commits: string[] },
  model = "gpt-4o-mini"
): Promise<string> {
  const response = await client.chat.completions.create({
    model,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "Draft clear GitHub release notes for an open-source project. Group changes into Features, Fixes, and Maintenance. Use markdown bullet points.",
      },
      {
        role: "user",
        content: `Version: ${input.version}\n\nCommits:\n${input.commits.join("\n")}`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "No response generated.";
}

export { triageIssue as triage, summarizePullRequest as summarizePr, draftReleaseNotes as releaseNotes };
