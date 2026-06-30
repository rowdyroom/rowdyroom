import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

type SongfinderMode = "normal" | "event" | "safe" | "emergency";
type SongStatus = "pending" | "approved" | "rejected";

type SongEntry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  query: string;
  normalizedQuery: string;
  title: string;
  channelTitle: string;
  videoId: string;
  url: string;
  thumbnailUrl?: string;
  source: "youtube" | "direct" | "manual";
  status: SongStatus;
  uses: number;
  lastUsedAt?: string;
  requester?: string;
};

type QuotaState = {
  date: string;
  searchesUsed: number;
  searchDailyLimit: number;
  searchPeakPerMinute: number;
  minuteWindow: string;
  searchesThisMinute: number;
};

type SongfinderConfig = {
  mode: SongfinderMode;
  hostOnlySearch: boolean;
  directLinksAllowed: boolean;
  lastChangedAt: string;
};

const dataDir = join(process.cwd(), ".rowdyroom");
const cachePath = join(dataDir, "songfinder-cache.json");
const quotaPath = join(dataDir, "songfinder-quota.json");
const configPath = join(dataDir, "songfinder-config.json");

const validModes = new Set<SongfinderMode>(["normal", "event", "safe", "emergency"]);

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function minuteKey() {
  return new Date().toISOString().slice(0, 16);
}

function numberFromEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function ensureDir() {
  mkdirSync(dataDir, { recursive: true });
}

function readJson<T>(path: string, fallback: T): T {
  try {
    if (!existsSync(path)) return fallback;
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(path: string, value: unknown) {
  ensureDir();
  writeFileSync(path, JSON.stringify(value, null, 2), "utf8");
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function readEntries(): SongEntry[] {
  const entries = readJson<SongEntry[]>(cachePath, []);
  return Array.isArray(entries) ? entries : [];
}

function writeEntries(entries: SongEntry[]) {
  writeJson(cachePath, entries.slice(0, 2000));
}

function defaultConfig(): SongfinderConfig {
  return {
    mode: "normal",
    hostOnlySearch: false,
    directLinksAllowed: true,
    lastChangedAt: new Date().toISOString(),
  };
}

function readConfig(): SongfinderConfig {
  return { ...defaultConfig(), ...readJson<Partial<SongfinderConfig>>(configPath, {}) };
}

function writeConfig(config: SongfinderConfig) {
  writeJson(configPath, config);
}

function defaultQuota(): QuotaState {
  return {
    date: todayKey(),
    searchesUsed: 0,
    searchDailyLimit: numberFromEnv("YOUTUBE_SEARCH_DAILY_LIMIT", 100),
    searchPeakPerMinute: numberFromEnv("YOUTUBE_SEARCH_PEAK_PER_MINUTE", 20),
    minuteWindow: minuteKey(),
    searchesThisMinute: 0,
  };
}

function readQuota(): QuotaState {
  const quota = { ...defaultQuota(), ...readJson<Partial<QuotaState>>(quotaPath, {}) };
  quota.searchDailyLimit = numberFromEnv("YOUTUBE_SEARCH_DAILY_LIMIT", quota.searchDailyLimit || 100);
  quota.searchPeakPerMinute = numberFromEnv("YOUTUBE_SEARCH_PEAK_PER_MINUTE", quota.searchPeakPerMinute || 20);

  if (quota.date !== todayKey()) {
    quota.date = todayKey();
    quota.searchesUsed = 0;
  }

  if (quota.minuteWindow !== minuteKey()) {
    quota.minuteWindow = minuteKey();
    quota.searchesThisMinute = 0;
  }

  return quota;
}

function writeQuota(quota: QuotaState) {
  writeJson(quotaPath, quota);
}

function sortedEntries(entries: SongEntry[]) {
  return [...entries].sort((a, b) => {
    if (b.uses !== a.uses) return b.uses - a.uses;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

function extractYouTubeVideoId(value: string): string | null {
  try {
    const text = value.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(text)) return text;
    const url = new URL(text);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).pop() ?? "";
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
  } catch {
    return null;
  }
  return null;
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 500) };
  }
}

async function fetchVideoDetails(videoId: string) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails,status");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", key);

  const response = await fetch(url);
  const json = await parseResponse(response);

  if (!response.ok) {
    throw new Error(json?.error?.message ?? json?.raw ?? "YouTube videos.list failed.");
  }

  const item = json?.items?.[0];
  if (!item) return null;

  return {
    title: item.snippet?.title ?? "YouTube video",
    channelTitle: item.snippet?.channelTitle ?? "Unknown channel",
    thumbnailUrl: item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url,
  };
}

async function searchYouTube(query: string) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("Missing YOUTUBE_API_KEY. Add it to .env.local and restart the server.");

  const quota = readQuota();
  if (quota.searchesUsed >= quota.searchDailyLimit) {
    throw new Error("YouTube search limit reached. Use cached songs or direct YouTube links.");
  }
  if (quota.searchesThisMinute >= quota.searchPeakPerMinute) {
    throw new Error("YouTube per-minute search limit reached. Wait one minute or use cached songs.");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("maxResults", "5");
  url.searchParams.set("q", query);
  url.searchParams.set("key", key);

  const response = await fetch(url);
  const json = await parseResponse(response);

  quota.searchesUsed += 1;
  quota.searchesThisMinute += 1;
  writeQuota(quota);

  if (!response.ok) {
    throw new Error(json?.error?.message ?? json?.raw ?? "YouTube search.list failed.");
  }

  return Array.isArray(json?.items) ? json.items : [];
}

function upsertEntries(entries: SongEntry[], incoming: SongEntry[]) {
  const byVideo = new Map(entries.map((entry) => [entry.videoId, entry]));
  const now = new Date().toISOString();

  for (const item of incoming) {
    const existing = byVideo.get(item.videoId);
    if (existing) {
      existing.updatedAt = now;
      existing.query = item.query || existing.query;
      existing.normalizedQuery = item.normalizedQuery || existing.normalizedQuery;
      existing.title = item.title || existing.title;
      existing.channelTitle = item.channelTitle || existing.channelTitle;
      existing.thumbnailUrl = item.thumbnailUrl || existing.thumbnailUrl;
      existing.source = item.source;
      existing.requester = item.requester || existing.requester;
    } else {
      entries.unshift(item);
      byVideo.set(item.videoId, item);
    }
  }

  return entries;
}

function cacheHit(entries: SongEntry[], normalizedQuery: string) {
  return entries.find((entry) =>
    entry.status === "approved" &&
    (entry.normalizedQuery === normalizedQuery || normalize(entry.title) === normalizedQuery)
  );
}

function publicState() {
  const entries = sortedEntries(readEntries());
  const config = readConfig();
  const quota = readQuota();

  return {
    ok: true,
    keyConfigured: Boolean(process.env.YOUTUBE_API_KEY),
    config,
    quota: {
      ...quota,
      searchesRemaining: Math.max(0, quota.searchDailyLimit - quota.searchesUsed),
    },
    entries: entries.slice(0, 100),
  };
}

async function addDirectLink(args: { url: string; requester?: string; query?: string }) {
  const videoId = extractYouTubeVideoId(args.url);
  if (!videoId) throw new Error("That does not look like a valid YouTube video link or video ID.");

  const details = await fetchVideoDetails(videoId).catch(() => null);
  const now = new Date().toISOString();
  const query = args.query?.trim() || details?.title || args.url;

  const entry: SongEntry = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    query,
    normalizedQuery: normalize(query),
    title: details?.title ?? "Direct YouTube link",
    channelTitle: details?.channelTitle ?? "Unknown channel",
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: details?.thumbnailUrl,
    source: "direct",
    status: "approved",
    uses: 1,
    lastUsedAt: now,
    requester: args.requester,
  };

  const entries = upsertEntries(readEntries(), [entry]);
  writeEntries(entries);
  return entry;
}

export async function GET() {
  return Response.json(publicState());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const action = typeof body?.action === "string" ? body.action : "status";

  try {
    if (action === "setMode") {
      const mode = typeof body?.mode === "string" && validModes.has(body.mode as SongfinderMode) ? body.mode as SongfinderMode : "normal";
      const config = readConfig();
      config.mode = mode;
      config.hostOnlySearch = mode === "event" || mode === "safe" || mode === "emergency";
      config.directLinksAllowed = mode !== "emergency" ? true : true;
      config.lastChangedAt = new Date().toISOString();
      writeConfig(config);
      return Response.json(publicState());
    }

    if (action === "resetDailyCounter") {
      writeQuota(defaultQuota());
      return Response.json(publicState());
    }

    if (action === "addDirectLink") {
      const config = readConfig();
      if (!config.directLinksAllowed) throw new Error("Direct links are disabled in the current Songfinder mode.");
      const url = typeof body?.url === "string" ? body.url : "";
      const requester = typeof body?.requester === "string" ? body.requester : undefined;
      const query = typeof body?.query === "string" ? body.query : undefined;
      const entry = await addDirectLink({ url, requester, query });
      return Response.json({ ...publicState(), entry, cacheHit: true });
    }

    if (action === "search") {
      const query = typeof body?.query === "string" ? body.query.trim() : "";
      const requester = typeof body?.requester === "string" ? body.requester : undefined;
      const hostSearch = body?.hostSearch === true;
      if (!query) throw new Error("Enter a song, artist, or YouTube link.");

      const videoId = extractYouTubeVideoId(query);
      if (videoId) {
        const entry = await addDirectLink({ url: query, requester, query });
        return Response.json({ ...publicState(), results: [entry], source: "direct", cacheHit: true });
      }

      const normalizedQuery = normalize(query);
      const entries = readEntries();
      const hit = cacheHit(entries, normalizedQuery);
      if (hit) {
        const now = new Date().toISOString();
        hit.uses += 1;
        hit.lastUsedAt = now;
        hit.updatedAt = now;
        writeEntries(entries);
        return Response.json({ ...publicState(), results: [hit], source: "cache", cacheHit: true });
      }

      const config = readConfig();
      if (config.mode === "safe" || config.mode === "emergency") {
        throw new Error("Songfinder Safe Mode is active. Use cached songs or direct YouTube links.");
      }
      if (config.hostOnlySearch && !hostSearch) {
        throw new Error("Host-only YouTube search is enabled. Viewers can use cached songs or direct links.");
      }

      const items = await searchYouTube(query);
      const now = new Date().toISOString();
      const incoming: SongEntry[] = items
        .map((item: any) => {
          const video = item?.id?.videoId;
          if (!video) return null;
          return {
            id: randomUUID(),
            createdAt: now,
            updatedAt: now,
            query,
            normalizedQuery,
            title: item.snippet?.title ?? "YouTube video",
            channelTitle: item.snippet?.channelTitle ?? "Unknown channel",
            videoId: video,
            url: `https://www.youtube.com/watch?v=${video}`,
            thumbnailUrl: item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url,
            source: "youtube" as const,
            status: "pending" as const,
            uses: 0,
            requester,
          };
        })
        .filter(Boolean) as SongEntry[];

      const updated = upsertEntries(entries, incoming);
      writeEntries(updated);
      return Response.json({ ...publicState(), results: incoming, source: "youtube", cacheHit: false });
    }

    if (action === "approve" || action === "reject" || action === "markUsed" || action === "delete") {
      const id = typeof body?.id === "string" ? body.id : "";
      const entries = readEntries();
      const index = entries.findIndex((entry) => entry.id === id);
      if (index === -1) throw new Error("Song entry not found.");
      const now = new Date().toISOString();

      if (action === "delete") {
        entries.splice(index, 1);
      } else if (action === "approve") {
        entries[index].status = "approved";
        entries[index].updatedAt = now;
      } else if (action === "reject") {
        entries[index].status = "rejected";
        entries[index].updatedAt = now;
      } else {
        entries[index].uses += 1;
        entries[index].lastUsedAt = now;
        entries[index].updatedAt = now;
        entries[index].status = "approved";
      }

      writeEntries(entries);
      return Response.json(publicState());
    }

    return Response.json(publicState());
  } catch (error) {
    return Response.json({ ...publicState(), ok: false, error: error instanceof Error ? error.message : "Songfinder request failed." }, { status: 400 });
  }
}
