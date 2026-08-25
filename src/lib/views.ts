/**
 * 펼친 횟수를 담아두는 곳.
 *
 * Upstash Redis의 REST API를 그대로 부른다. 의존성을 하나 더 들이는 대신
 * fetch 두 줄로 끝나고, 나중에 Vercel KV로 옮겨도 같은 API가 통한다.
 *
 * 환경변수가 없으면 조용히 null을 돌려준다. 아직 저장소를 붙이지 않았거나
 * 저장소가 잠시 닿지 않는다고 해서 글 읽는 일이 막히면 안 된다.
 */
const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const key = (slug: string) => `mg:views:${slug}`;

export function viewsConfigured(): boolean {
  return Boolean(REST_URL && REST_TOKEN);
}

async function command(...parts: string[]): Promise<unknown> {
  if (!REST_URL || !REST_TOKEN) return null;
  try {
    const res = await fetch(`${REST_URL}/${parts.map(encodeURIComponent).join("/")}`, {
      headers: { Authorization: `Bearer ${REST_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { result?: unknown };
    return body.result ?? null;
  } catch {
    // 저장소에 닿지 못하면 숫자를 감출 뿐, 페이지는 그대로 뜬다
    return null;
  }
}

function toCount(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : 0;
}

/** 한 권을 펼쳤다고 기록하고 누적 횟수를 돌려준다. */
export async function openBook(slug: string): Promise<number | null> {
  const result = await command("incr", key(slug));
  return result === null ? null : toCount(result);
}

/** 한 권의 누적 횟수. 기록이 없으면 0. */
export async function countOf(slug: string): Promise<number | null> {
  const result = await command("get", key(slug));
  if (!viewsConfigured()) return null;
  return toCount(result);
}

/** 여러 권을 한 번에. 서재 화면용. */
export async function countsOf(
  slugs: string[]
): Promise<Record<string, number> | null> {
  if (!viewsConfigured() || slugs.length === 0) return null;
  const result = await command("mget", ...slugs.map(key));
  if (!Array.isArray(result)) return null;
  return Object.fromEntries(slugs.map((slug, i) => [slug, toCount(result[i])]));
}
