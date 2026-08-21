/**
 * Collect repo candidates from GitHub, drop ones already in any category
 * list, refresh catalog JSON from the GitHub API, then LLM-judge new
 * candidates into public/data/<category>.json.
 *
 *   GITHUB_TOKEN=ghp_… CLOUDFLARE_AUTH_TOKEN=… npm run update-repos
 */
import { classifyAndApply } from './classify-repos.ts';
import { loadCatalog, writeCatalog, writeDiscovered } from './file-helper.ts';
import { hasCfToken, requireCfToken } from './llm-judge.ts';
import { collectRepos, existingSlugs, requireToken, updateCatalog } from './repo-helper.ts';

async function main(): Promise<void> {
  const token = requireToken();
  const catalog = loadCatalog();
  const listed = existingSlugs(catalog);

  const found = await collectRepos(token);
  const finalList = found.filter((repo) => !listed.has(repo.slug.toLowerCase()));

  await updateCatalog(catalog, token);
  writeCatalog(catalog);
  writeDiscovered(finalList);
  console.log(`refreshed ${listed.size} listed repos in ${catalog.length} files`);
  console.log(`${finalList.length} new candidates -> data/discovered.json`);

  if (!hasCfToken()) {
    console.log('skip classify: set CLOUDFLARE_AUTH_TOKEN (or CLOUDFLARE_API_TOKEN)');
    return;
  }
  await classifyAndApply(catalog, finalList, token, requireCfToken());
}

await main();
