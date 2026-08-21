/**
 * Judge discovered repos with Cloudflare Workers AI (Gemma) and append
 * accepted ones to public/data/<category>.json.
 *
 *   CLOUDFLARE_AUTH_TOKEN=… GITHUB_TOKEN=… npm run classify-repos
 *
 * Token: CLOUDFLARE_AUTH_TOKEN or CLOUDFLARE_API_TOKEN. Account defaults to the provided Workers AI account.
 */
import { loadCatalog, loadDiscovered, writeCatalog, writeClassified } from './file-helper.ts';
import { judgeRepo, requireCfToken } from './llm-judge.ts';
import { existingSlugs, fetchReadme, requireToken, sleep, toListedRepo } from './repo-helper.ts';
import { CATALOG_CATEGORY_IDS, type CatalogCategoryId, type GitHubRepo, type JudgeVerdict } from './types.ts';

const LLM_GAP_MS = 400;
const MIN_CONFIDENCE = 0.6;

function isCatalogId(id: string): id is CatalogCategoryId {
  return (CATALOG_CATEGORY_IDS as readonly string[]).includes(id);
}

function applyVerdicts(
  catalog: ReturnType<typeof loadCatalog>,
  repos: GitHubRepo[],
  verdicts: JudgeVerdict[]
): { added: number; skipped: number } {
  const listed = existingSlugs(catalog);
  const bySlug = new Map(repos.map((r) => [r.slug.toLowerCase(), r]));
  let added = 0;
  let skipped = 0;

  for (const verdict of verdicts) {
    if (!isCatalogId(verdict.category) || verdict.confidence < MIN_CONFIDENCE || !verdict.summary) {
      skipped += 1;
      continue;
    }
    const key = verdict.slug.toLowerCase();
    if (listed.has(key)) {
      skipped += 1;
      continue;
    }
    const repo = bySlug.get(key);
    const file = catalog.find((entry) => entry.data.id === verdict.category);
    if (!repo || !file) {
      skipped += 1;
      continue;
    }
    file.data.repos.push(toListedRepo(repo, verdict.summary));
    listed.add(key);
    added += 1;
    console.log(`+ ${verdict.category} ${verdict.slug} (${verdict.confidence.toFixed(2)}) ${verdict.summary}`);
  }

  return { added, skipped };
}

export async function classifyAndApply(
  catalog: ReturnType<typeof loadCatalog>,
  repos: GitHubRepo[],
  githubToken: string,
  cfToken: string
): Promise<void> {
  if (repos.length === 0) {
    console.log('no discovered candidates to classify');
    return;
  }

  const verdicts: JudgeVerdict[] = [];
  for (const [i, repo] of repos.entries()) {
    if (i > 0) await sleep(LLM_GAP_MS);
    try {
      const readme = await fetchReadme(githubToken, repo.owner, repo.name);
      const verdict = await judgeRepo(cfToken, repo, readme);
      verdicts.push(verdict);
      console.log(
        `judge ${repo.slug} -> ${verdict.category} ${verdict.confidence.toFixed(2)} ${verdict.rationale}`
      );
    } catch (err) {
      console.warn(`judge skip ${repo.slug}: ${err instanceof Error ? err.message : err}`);
    }
  }

  writeClassified(verdicts);
  const { added, skipped } = applyVerdicts(catalog, repos, verdicts);
  writeCatalog(catalog);
  console.log(`classified ${verdicts.length}: added ${added}, skipped ${skipped} -> catalog`);
}

async function main(): Promise<void> {
  const githubToken = requireToken();
  const cfToken = requireCfToken();
  const catalog = loadCatalog();
  const listed = existingSlugs(catalog);
  const repos = loadDiscovered().filter((repo) => !listed.has(repo.slug.toLowerCase()));
  await classifyAndApply(catalog, repos, githubToken, cfToken);
}

if (process.argv[1]?.endsWith('classify-repos.ts')) {
  await main();
}
