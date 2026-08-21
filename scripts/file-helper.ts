import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CategoryFile, GitHubRepo, JudgeVerdict } from './types.ts';

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, 'public', 'data');
const DISCOVERED_PATH = join(ROOT, 'data', 'discovered.json');
const CLASSIFIED_PATH = join(ROOT, 'data', 'classified.json');

export function loadCatalog(): { file: string; data: CategoryFile }[] {
  return readdirSync(DATA_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((file) => ({
      file,
      data: JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8')) as CategoryFile,
    }));
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeCatalog(catalog: { file: string; data: CategoryFile }[]): void {
  for (const { file, data } of catalog) {
    writeJson(join(DATA_DIR, file), data);
  }
}

export function writeDiscovered(repos: GitHubRepo[]): void {
  mkdirSync(join(ROOT, 'data'), { recursive: true });
  const sorted = [...repos].sort((a, b) => b.stars - a.stars);
  writeJson(DISCOVERED_PATH, { repos: sorted });
}

export function loadDiscovered(): GitHubRepo[] {
  try {
    const raw = JSON.parse(readFileSync(DISCOVERED_PATH, 'utf8')) as { repos?: GitHubRepo[] };
    return raw.repos ?? [];
  } catch {
    return [];
  }
}

export function writeClassified(verdicts: JudgeVerdict[]): void {
  mkdirSync(join(ROOT, 'data'), { recursive: true });
  writeJson(CLASSIFIED_PATH, { verdicts });
}
