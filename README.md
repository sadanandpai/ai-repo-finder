# AI Repo Finder

Curated GitHub catalog of repos that make coding agents useful.

Live: [sadanandpai.github.io/ai-repo-finder](https://sadanandpai.github.io/ai-repo-finder/)

## Categories

Each bucket is defined by **what the tool operates on**:

| Category                                  | Object                   | Data                           |
| ----------------------------------------- | ------------------------ | ------------------------------ |
| [Coding](public/data/coding.json)         | a codebase               | index, pack, review, IDE       |
| [Agent](public/data/agent.json)           | the agent runtime        | runtimes, MCP, browser, memory |
| [Frameworks](public/data/frameworks.json) | how you build            | SDKs, protocols, frameworks    |
| [Skills](public/data/skills.json)         | the agent's instructions | SKILL.md, `.agents`, packs     |

Lists live in `public/data/<slug>.json`. Category metadata is in `src/logic/categories.ts`.

## Develop

```bash
npm install
npm run dev
npm run build
npm run lint
```

Node 24. Vite + React 19. Hash router so GitHub Pages works without a `404.html` rewrite
(`/ai-repo-finder/#/explore/coding`).

## Refresh catalog stats

Fetches listed repos from the GitHub API, writes new candidates to `data/discovered.json`,
then classifies them with Cloudflare Workers AI (`@cf/google/gemma-4-26b-a4b-it`) and appends accepted repos to
`public/data/<category>.json`. `none` / low-confidence verdicts are skipped.

```bash
GITHUB_TOKEN=ghp_… CLOUDFLARE_AUTH_TOKEN=… npm run update-repos
```

Classify an existing `data/discovered.json` only:

```bash
GITHUB_TOKEN=ghp_… CLOUDFLARE_AUTH_TOKEN=… npm run classify-repos
```

Optional: `CLOUDFLARE_ACCOUNT_ID` (defaults to the provided account), `CLOUDFLARE_AI_MODEL`.

Add another GitHub search in `scripts/repo-helper.ts` (`collectRepos()`).

GitHub Action: `.github/workflows/update-repos.yml` — daily 08:00 IST (02:30 UTC) + manual dispatch. Commits
catalog diffs; uploads `discovered.json` as an artifact. Set repo secret `CLOUDFLARE_AUTH_TOKEN` (or `CLOUDFLARE_API_TOKEN`) so classify runs in CI.

## Deploy

Push to `main` → `.github/workflows/deploy-pages.yml` builds and deploys GitHub Pages.
