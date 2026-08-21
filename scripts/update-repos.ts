/**
 * Collect repo candidates from GitHub, drop ones already in any category
 * list, then refresh catalog JSON from the GitHub API.
 *
 * Discovery searches live in collectRepos() (popular + 7d/30d growth proxies).
 *
 *   GITHUB_TOKEN=ghp_… npm run update-repos
 */
import { loadCatalog, writeCatalog, writeDiscovered } from './file-helper.ts';
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
}

await main();
