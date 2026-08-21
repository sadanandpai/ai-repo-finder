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

Fetches listed repos from the GitHub API and writes new candidates (not in any list) to
`data/discovered.json`.

```bash
GITHUB_TOKEN=ghp_… npm run update-repos
```

Add another GitHub search in `scripts/repo-helper.ts` (`collectRepos()`).

GitHub Action: `.github/workflows/update-repos.yml` — daily 08:00 IST (02:30 UTC) + manual dispatch. Commits
catalog diffs; uploads `discovered.json` as an artifact.

## Deploy

Push to `main` → `.github/workflows/deploy-pages.yml` builds and deploys GitHub Pages.
