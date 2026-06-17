# openai-oss

CLI toolkit that helps **open-source maintainers** automate repetitive work: issue triage, pull request summaries, and release note drafting.

Maintainers spend a large share of their time on triage, review, and release hygiene. This project packages small, composable workflows that can run locally or inside GitHub Actions.

## Features

- **Issue triage** — suggest labels, priority, and a first maintainer reply
- **PR summaries** — highlight intent, risks, and review recommendations from a diff
- **Release notes** — turn commit messages into structured changelog sections
- **GitHub Actions ready** — example workflow for PR review assistance

## Quick start

```bash
git clone https://github.com/FATHERYARIK/openai-oss.git
cd openai-oss
npm install
export OPENAI_API_KEY=sk-...

# Triage an issue
npm run dev -- triage --title "Crash on startup" --body "App exits when loading config on Windows 11"

# Summarize a PR
npm run dev -- pr-summary --title "Add config validation" --diff-file ./pr.diff

# Draft release notes
npm run dev -- release-notes --version v0.2.0 --commits-file ./commits.txt
```

## Use in CI

See [`.github/workflows/pr-assist.yml`](./.github/workflows/pr-assist.yml) for a maintainer workflow that posts a PR summary comment when `OPENAI_API_KEY` is configured as a repository secret.

## Why this project exists

Small and mid-size OSS projects rarely have dedicated triage bots or release automation. **openai-oss** is a lightweight, MIT-licensed toolkit that maintainers can adopt without running heavy infrastructure.

## Roadmap

- [ ] GitHub App integration for automatic issue labeling
- [ ] Optional security checklist for dependency updates
- [ ] npm publish for zero-install `npx` usage

## Contributing

Issues and pull requests are welcome. Please open a discussion first for large changes.

## License

MIT — see [LICENSE](./LICENSE).
