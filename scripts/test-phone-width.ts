/**
 * Phone-width overflow check (issue #55).
 *
 * The definition of done says phone width means 390px and 320px without
 * horizontal scroll. The header collapses into a native `details` menu below
 * lg, and the overflow only appears once that menu is OPEN, so a check that
 * merely loads the page misses it. This drives a real headless Chrome over the
 * DevTools protocol, opens the menu, and compares scrollWidth to clientWidth.
 *
 * Usage: npx tsx scripts/test-phone-width.ts [origin]
 * Needs a server already running (npm run build && npx next start -p 3311).
 */
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const origin = process.argv[2] ?? "http://localhost:3311";
/** Tailwind's lg: above it the nav is a bar, below it a details disclosure. */
const LG_BREAKPOINT = 1024;
/** The header CTA, from the createInvoice rung in src/lib/cta.ts. */
const BUTTON_LABEL = "Create an invoice";
const widths = [320, 390];
const paths = ["/", "/payments", "/invoices"];

const chromePaths = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter((p): p is string => Boolean(p));

type Overflow = { tag: string; cls: string; text: string; left: number; right: number };
type Measurement = {
  scrollWidth: number;
  clientWidth: number;
  menuOpened: boolean;
  offenders: Overflow[];
  markVisible: boolean;
  nameVisible: boolean;
  buttonFound: boolean;
  nameTruncated: boolean;
  nameText: string;
  buttonVisible: boolean;
};

/** Runs in the page. Optionally opens every `details` first, then measures. */
function measureSource(openMenu: boolean): string {
  return `(() => {
    let menuOpened = false;
    if (${openMenu}) {
      for (const d of document.querySelectorAll("details")) {
        d.open = true;
        menuOpened = true;
      }
    }
    const doc = document.documentElement;
    const clientWidth = doc.clientWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      // Skip-links and visually-hidden text are parked off-screen on purpose
      // and do not create scrollable overflow. This only trims the diagnostic
      // list; pass/fail is scrollWidth, so it cannot hide a real failure.
      // classList, not className: on SVG the latter is an SVGAnimatedString.
      if (el.classList.contains("sr-only")) continue;
      if (r.right > clientWidth + 0.5) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute("class") ?? "").slice(0, 60),
          text: (el.textContent ?? "").trim().slice(0, 24),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
    // The style guide requires the mark, the site name, and the button to stay
    // visible at every width, and a truncated wordmark is not the site name.
    const nameEl = document.querySelector("header a[aria-label] span");
    const btnEl = [...document.querySelectorAll("header a")].find((a) =>
      (a.textContent || "").includes(${JSON.stringify(BUTTON_LABEL)}),
    );
    const markEl = document.querySelector("header a[aria-label] svg");
    const onScreen = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.left >= -0.5 && r.right <= clientWidth + 0.5;
    };

    return JSON.stringify({
      scrollWidth: doc.scrollWidth,
      clientWidth,
      menuOpened,
      offenders: offenders.slice(0, 12),
      markVisible: onScreen(markEl),
      nameVisible: onScreen(nameEl),
      buttonFound: !!btnEl,
      nameTruncated: nameEl ? nameEl.scrollWidth > nameEl.clientWidth + 0.5 : false,
      nameText: (nameEl?.textContent || "").trim(),
      buttonVisible: onScreen(btnEl),
    });
  })()`;
}

async function cdp(port: number, path: string): Promise<unknown> {
  // Chrome requires PUT on /json/new since M111; older builds accept GET.
  const method = path.startsWith("/json/new") ? "PUT" : "GET";
  let res = await fetch(`http://127.0.0.1:${port}${path}`, { method });
  if (res.status === 405 && method === "PUT") {
    res = await fetch(`http://127.0.0.1:${port}${path}`);
  }
  if (!res.ok) throw new Error(`CDP ${path}: ${res.status}`);
  return res.json();
}

/** Minimal CDP client: one websocket, sequential commands. */
async function withPage<T>(
  wsUrl: string,
  fn: (send: (method: string, params?: Record<string, unknown>) => Promise<Record<string, unknown>>) => Promise<T>,
): Promise<T> {
  const ws = new WebSocket(wsUrl);
  const pending = new Map<number, { resolve: (v: Record<string, unknown>) => void; reject: (e: Error) => void }>();
  let nextId = 1;

  await new Promise<void>((resolve, reject) => {
    ws.addEventListener("open", () => resolve(), { once: true });
    ws.addEventListener("error", () => reject(new Error("websocket failed")), { once: true });
  });

  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(String(ev.data)) as { id?: number; result?: Record<string, unknown>; error?: { message: string } };
    if (typeof msg.id !== "number") return;
    const slot = pending.get(msg.id);
    if (!slot) return;
    pending.delete(msg.id);
    if (msg.error) slot.reject(new Error(msg.error.message));
    else slot.resolve(msg.result ?? {});
  });

  const send = (method: string, params: Record<string, unknown> = {}) =>
    new Promise<Record<string, unknown>>((resolve, reject) => {
      const id = nextId++;
      // Clear the timer on settle, or the pending 20s timeouts keep node
      // alive long after the work is done.
      const timer = setTimeout(() => {
        if (pending.delete(id)) reject(new Error(`${method} timed out`));
      }, 20_000);
      pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      ws.send(JSON.stringify({ id, method, params }));
    });

  try {
    return await fn(send);
  } finally {
    ws.close();
  }
}

async function measure(wsUrl: string, url: string, width: number, openMenu: boolean): Promise<Measurement> {
  return withPage(wsUrl, async (send) => {
    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 780,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await send("Page.navigate", { url });
    // Settle: poll readyState rather than a fixed sleep. A blank document
    // measures as scrollWidth === clientWidth, so giving up here and
    // measuring anyway would report a silent pass. Fail loudly instead.
    let ready = false;
    for (let i = 0; i < 100; i++) {
      const r = (await send("Runtime.evaluate", {
        expression: "document.readyState === 'complete' && !!document.querySelector('header')",
        returnByValue: true,
      })) as { result?: { value?: boolean } };
      if (r.result?.value) {
        ready = true;
        break;
      }
      await new Promise((r2) => setTimeout(r2, 100));
    }
    if (!ready) throw new Error(`${url} never finished rendering a header at ${width}px`);
    // Webfonts change text metrics, so wait for the real condition.
    await send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
    const out = (await send("Runtime.evaluate", {
      expression: measureSource(openMenu),
      returnByValue: true,
    })) as { result?: { value?: string } };
    return JSON.parse(out.result?.value ?? "{}") as Measurement;
  });
}

async function main() {
  const chrome = chromePaths.find((p) => existsSync(p));
  if (!chrome) {
    // Skipping locally is a convenience. Skipping in CI would turn this into a
    // check that is green because it never ran, which is worse than no check.
    const message = "phone-width: no Chrome found; set CHROME_PATH.";
    if (process.env.CI) {
      console.error(`${message} Refusing to skip in CI.`);
      process.exit(1);
    }
    console.error(`${message} Skipping.`);
    process.exit(0);
  }

  const probe = await fetch(origin).catch(() => null);
  if (!probe?.ok) {
    console.error(`phone-width: nothing serving at ${origin}. Run: npm run build && npx next start -p 3311`);
    process.exit(1);
  }

  const profile = mkdtempSync(join(tmpdir(), "cb-phone-"));
  let proc: ChildProcess | undefined;
  const failures: string[] = [];

  try {
    proc = spawn(
      chrome,
      [
        "--headless=new",
        "--remote-debugging-port=0",
        `--user-data-dir=${profile}`,
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-gpu",
        "about:blank",
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );

    // Chrome prints the devtools endpoint on stderr when the port is 0.
    const port = await new Promise<number>((resolve, reject) => {
      let buf = "";
      const onData = (d: Buffer) => {
        buf += d.toString();
        const m = buf.match(/ws:\/\/127\.0\.0\.1:(\d+)\//);
        if (m) resolve(Number(m[1]));
      };
      proc?.stderr?.on("data", onData);
      setTimeout(() => reject(new Error("chrome did not report a debugging port")), 20_000);
    });

    for (const path of paths) {
      for (const width of widths) {
        // The disclosure only exists below lg; above it the menu is the bar.
        for (const openMenu of width < LG_BREAKPOINT ? [false, true] : [false]) {
          const targets = (await cdp(port, "/json/new?about:blank")) as { webSocketDebuggerUrl: string; id: string };
          const m = await measure(targets.webSocketDebuggerUrl, `${origin}${path}`, width, openMenu);
          await fetch(`http://127.0.0.1:${port}/json/close/${targets.id}`).catch(() => {});

          const state = openMenu ? "menu open" : "menu closed";
          const where = `${path} at ${width}px (${state})`;
          // The criterion is horizontal scroll, which is what a visitor feels.
          // Offenders are printed to locate it, not to define it.
          const overflow = m.scrollWidth - m.clientWidth;
          if (overflow > 0) {
            failures.push(
              `FAIL ${where}: scrollWidth ${m.scrollWidth} vs clientWidth ${m.clientWidth}` +
                (m.offenders.length
                  ? `\n     ${m.offenders.map((o) => `<${o.tag}> [${o.left}..${o.right}] ${o.cls} :: ${o.text}`).join("\n     ")}`
                  : ""),
            );
          } else {
            console.log(`ok: ${where} has no horizontal overflow`);
          }

          // Header integrity, in both menu states: the open panel is absolutely
          // positioned and should never push the row, so assert rather than assume.
          if (m.buttonFound) {
            const missing = [
              m.markVisible ? null : "the mark",
              m.nameVisible ? null : "the site name",
              m.buttonVisible ? null : "the button",
            ].filter(Boolean);
            if (missing.length) {
              failures.push(`FAIL ${where}: ${missing.join(", ")} not fully on screen`);
            } else if (m.nameTruncated) {
              failures.push(
                `FAIL ${where}: the site name is truncated to "${m.nameText}"; a clipped wordmark is not the site name`,
              );
            } else {
              console.log(`ok: ${where} shows the mark, "${m.nameText}", and the button in full`);
            }
          } else {
            // Say what is actually wrong rather than blaming the layout.
            failures.push(
              `FAIL ${where}: no header button matching ${BUTTON_LABEL} was found; update this check if the CTA label changed`,
            );
          }
        }
      }
    }
  } finally {
    proc?.kill();
    // Chrome unlinks its profile lazily; rmdir races it. Best effort only.
    await new Promise((r) => setTimeout(r, 300));
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    } catch {
      /* a leftover temp profile is not a test failure */
    }
  }

  if (failures.length) {
    console.error(`\nphone-width: ${failures.length} failure(s)\n`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log("all phone-width checks passed");
}

main().catch((err) => {
  console.error("phone-width: error", err);
  process.exit(1);
});
