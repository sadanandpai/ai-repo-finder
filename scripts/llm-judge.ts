import { Cloudflare } from 'cloudflare';
import type { GitHubRepo, JudgeCategory, JudgeVerdict } from './types.ts';
import { CATALOG_CATEGORY_IDS } from './types.ts';

const CF_ACCOUNT =
  process.env.CLOUDFLARE_ACCOUNT_ID || 'faa95aba95547b8028908f1fe1a541f2';
const CF_MODEL = process.env.CLOUDFLARE_AI_MODEL || '@cf/google/gemma-4-26b-a4b-it';

const SYSTEM = `You are a strict curator for ai-repo-finder, a catalog of GitHub repos that make coding agents useful.

Assign exactly one category by what the tool operates on — not by "uses AI".

Categories:
- coding: object is a codebase (index, pack, review, IDE, code graph)
- agent: object is the agent runtime (runtimes, MCP servers, browser, memory)
- frameworks: object is how you build (SDKs, protocols, orchestrators, gateways)
- skills: object is the agent's instructions (SKILL.md, .agents, skill packs)
- none: not a coding-agent catalog item (models, datasets, generic ML, blogs, wrappers)

Rules:
- Prefer none. One category max. Categories are mutually exclusive.
- Object test: if you remove the codebase / runtime / build SDK / skill pack, does the repo still make sense?
- summary: one sentence, catalog voice, no marketing fluff. Empty if none.
- Reply with a single JSON object only. No markdown.

Examples:
{"category":"coding","confidence":0.95,"summary":"Pre-indexed code knowledge graph for coding agents.","rationale":"Operates on a repo as a code graph."}
{"category":"agent","confidence":0.94,"summary":"Make websites accessible for AI agents.","rationale":"Browser runtime the agent uses."}
{"category":"frameworks","confidence":0.93,"summary":"TypeScript framework for AI-powered apps and agents.","rationale":"SDK for building agents."}
{"category":"skills","confidence":0.96,"summary":"Reusable agent skills from a real .agents directory.","rationale":"Installable agent instructions."}
{"category":"none","confidence":0.9,"summary":"","rationale":"Generic ML library, not a coding-agent tool."}`;

export function requireCfToken(): string {
  const token = process.env.CLOUDFLARE_AUTH_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    throw new Error('Set CLOUDFLARE_AUTH_TOKEN (or CLOUDFLARE_API_TOKEN) for Workers AI classify.');
  }
  return token;
}

export function hasCfToken(): boolean {
  return Boolean(process.env.CLOUDFLARE_AUTH_TOKEN || process.env.CLOUDFLARE_API_TOKEN);
}

type CfEnvelope = {
  success?: boolean;
  errors?: { message?: string }[];
  result?: unknown;
};

let cachedClient: { token: string; client: Cloudflare } | null = null;

function cfClient(token: string): Cloudflare {
  if (cachedClient?.token === token) return cachedClient.client;
  const client = new Cloudflare({ apiToken: token });
  cachedClient = { token, client };
  return client;
}

function extractJsonObject(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1].trim() : trimmed;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error(`no JSON object in model output: ${text.slice(0, 180)}`);
  }
  return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
}

function messageContent(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value !== 'object' || value === null) return '';
  const c = (value as { content?: unknown }).content;
  if (typeof c === 'string') return c;
  if (Array.isArray(c)) {
    return c
      .map((part) => {
        if (typeof part === 'string') return part;
        if (typeof part === 'object' && part && 'text' in part) {
          const t = (part as { text?: unknown }).text;
          return typeof t === 'string' ? t : '';
        }
        return '';
      })
      .join('');
  }
  return '';
}

function geminiText(value: unknown): string {
  if (typeof value !== 'object' || value === null) return '';
  const r = value as Record<string, unknown>;
  const candidates = r.candidates;
  if (!Array.isArray(candidates) || !candidates[0]) return '';
  const content = (candidates[0] as { content?: unknown }).content;
  if (typeof content !== 'object' || content === null) return '';
  const parts = (content as { parts?: unknown }).parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((part) => {
      if (typeof part === 'object' && part && 'text' in part) {
        const t = (part as { text?: unknown }).text;
        return typeof t === 'string' ? t : '';
      }
      return '';
    })
    .join('');
}

function cfResponseText(payload: unknown): string {
  if (typeof payload !== 'object' || payload === null) return '';
  const root = payload as Record<string, unknown>;
  const result = root.result ?? root;
  if (typeof result === 'string') return result;
  if (typeof result !== 'object' || result === null) return '';
  const r = result as Record<string, unknown>;
  const fromGemini = geminiText(r) || geminiText(r.output) || geminiText(r.response);
  if (fromGemini) return fromGemini;
  if (typeof r.response === 'string') return r.response;
  const fromResponse = messageContent(r.response);
  if (fromResponse) return fromResponse;
  if (Array.isArray(r.choices) && r.choices[0]) {
    const fromChoice = messageContent((r.choices[0] as { message?: unknown }).message);
    if (fromChoice) return fromChoice;
  }
  return messageContent(r);
}

function parseVerdict(slug: string, raw: Record<string, unknown>): JudgeVerdict {
  const category = raw.category;
  const allowed: JudgeCategory[] = [...CATALOG_CATEGORY_IDS, 'none'];
  if (typeof category !== 'string' || !allowed.includes(category as JudgeCategory)) {
    throw new Error(`bad category for ${slug}: ${String(category)}`);
  }
  const confidence = typeof raw.confidence === 'number' ? raw.confidence : 0;
  const summary = typeof raw.summary === 'string' ? raw.summary.trim() : '';
  const rationale = typeof raw.rationale === 'string' ? raw.rationale.trim() : '';
  return {
    slug,
    category: category as JudgeCategory,
    confidence,
    summary,
    rationale,
  };
}

export async function judgeRepo(
  token: string,
  repo: GitHubRepo,
  readme: string
): Promise<JudgeVerdict> {
  const user = [
    `slug: ${repo.slug}`,
    `language: ${repo.language || '(unknown)'}`,
    `stars: ${repo.stars}`,
    `description: ${repo.description || '(none)'}`,
    `readme:\n${readme || '(none)'}`,
  ].join('\n');

  const payload = await cfClient(token).post<CfEnvelope>(
    `/accounts/${CF_ACCOUNT}/ai/run/${CF_MODEL}`,
    {
      body: {
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: user },
        ],
      },
    }
  );

  if (payload.success === false) {
    const msg = payload.errors?.[0]?.message ?? JSON.stringify(payload).slice(0, 180);
    throw new Error(`Cloudflare AI error: ${msg}`);
  }

  const text = cfResponseText(payload);
  if (!text) {
    throw new Error(`empty model response for ${repo.slug}: ${JSON.stringify(payload).slice(0, 180)}`);
  }
  return parseVerdict(repo.slug, extractJsonObject(text));
}
