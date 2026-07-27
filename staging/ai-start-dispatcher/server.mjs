import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DispatcherError, DispatcherStore } from "./lib/dispatcher-store.mjs";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC = join(ROOT, "public");

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(`${JSON.stringify(body, null, 2)}\n`);
}

function text(response, status, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(body);
}

async function bodyOf(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1_000_000) {
      throw new DispatcherError(413, "payload_too_large", "Payload too large");
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  const raw = Buffer.concat(chunks).toString("utf8");
  const contentType = request.headers["content-type"] || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new DispatcherError(400, "invalid_json", "Request body must be valid JSON");
  }
}

function clientsFromEnvironment() {
  if (!process.env.AI_START_CLIENTS_JSON) return [];
  const clients = JSON.parse(process.env.AI_START_CLIENTS_JSON);
  if (!Array.isArray(clients)) throw new Error("AI_START_CLIENTS_JSON must be an array");
  return clients;
}

export function createDispatcherServer({
  dataDir = process.env.AI_START_DATA_DIR || join(ROOT, "data"),
  clients = clientsFromEnvironment(),
  leaseMs = Number(process.env.AI_START_LEASE_MS || 30 * 60 * 1000),
  clock,
  seed,
} = {}) {
  const store = new DispatcherStore({ dataDir, clients, leaseMs, clock, seed });

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      if (url.pathname === "/api.php") {
        const action = url.searchParams.get("action") || "";
        const body = request.method === "POST" ? await bodyOf(request) : {};
        const idempotencyKey =
          request.headers["idempotency-key"] || body.idempotencyKey || "";
        const leaseToken = request.headers["x-lease-token"] || body.leaseToken || "";
        const authorization = request.headers.authorization || "";
        const actorForRead = () => store.authenticate(authorization);
        const actorForWrite = () => store.authenticate(authorization);

        if (request.method === "GET" && action === "health") {
          return json(response, 200, store.health());
        }
        if (request.method === "GET" && action === "dispatcher_health") {
          return json(response, 200, store.dispatcherHealth());
        }
        if (request.method === "GET" && action === "updates14") {
          return json(response, 200, { ok: true, updates: store.listUpdates() });
        }
        if (request.method === "GET" && action === "updates_old") {
          return json(response, 200, {
            ok: true,
            updates: store.listUpdates({ old: true }),
          });
        }
        if (request.method === "GET" && action === "bots") {
          return json(response, 200, { ok: true, bots: store.listBots() });
        }
        if (request.method === "GET" && action === "export_json") {
          return json(response, 200, store.exportData());
        }
        if (request.method === "GET" && action === "export_markdown") {
          return text(response, 200, store.exportMarkdown(), "text/markdown; charset=utf-8");
        }
        if (request.method === "GET" && action === "mission_next") {
          return json(response, 200, store.nextMission(actorForRead()));
        }
        if (request.method === "GET" && action === "mission_get") {
          return json(
            response,
            200,
            store.getMission(
              actorForRead(),
              url.searchParams.get("missionId"),
              url.searchParams.get("cursor"),
            ),
          );
        }
        if (request.method === "GET" && action === "mission_inbox") {
          return json(
            response,
            200,
            store.inbox(actorForRead(), url.searchParams.get("cursor")),
          );
        }
        if (request.method === "GET" && action === "missions_since") {
          return json(
            response,
            200,
            store.missionsSince(actorForRead(), url.searchParams.get("cursor")),
          );
        }

        if (request.method !== "POST") {
          throw new DispatcherError(405, "method_not_allowed", "Method not allowed");
        }

        const actor = actorForWrite();
        const actions = {
          save_update: () => store.saveLegacyUpdate(actor, body, idempotencyKey),
          save_bot: () => store.saveLegacyBot(actor, body, idempotencyKey),
          import_json: () => store.importData(actor, body, idempotencyKey),
          mission_create: () => store.createMission(actor, body, idempotencyKey),
          mission_claim: () => store.claimMission(actor, body, idempotencyKey),
          mission_start: () =>
            store.startMission(actor, body, idempotencyKey, leaseToken),
          mission_event: () =>
            store.addMissionEvent(actor, body, idempotencyKey, leaseToken),
          mission_transition: () =>
            store.transitionMission(actor, body, idempotencyKey, leaseToken),
          mission_heartbeat: () =>
            store.heartbeat(actor, body, idempotencyKey, leaseToken),
          mission_release: () =>
            store.releaseMission(actor, body, idempotencyKey, leaseToken),
          message_ack: () => store.acknowledge(actor, body, idempotencyKey),
        };
        if (!actions[action]) {
          throw new DispatcherError(404, "unknown_action", "Unknown action");
        }
        return json(response, 200, actions[action]());
      }

      const staticFiles = {
        "/": "index.html",
        "/index.html": "index.html",
        "/app.js": "app.js",
        "/styles.css": "styles.css",
      };
      const file = staticFiles[url.pathname];
      if (!file) return text(response, 404, "Not found\n");
      const types = {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
      };
      return text(
        response,
        200,
        readFileSync(join(PUBLIC, file)),
        types[extname(file)],
      );
    } catch (error) {
      const status = error instanceof DispatcherError ? error.status : 500;
      const code = error instanceof DispatcherError ? error.code : "internal_error";
      const message =
        error instanceof DispatcherError ? error.message : "Internal server error";
      return json(response, status, {
        ok: false,
        error: code,
        message,
        ...(error.details ? { fields: error.details } : {}),
      });
    }
  });

  return { server, store };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 8787);
  const { server } = createDispatcherServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`AI Start dispatcher staging: http://127.0.0.1:${port}`);
  });
}
