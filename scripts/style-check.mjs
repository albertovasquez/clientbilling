#!/usr/bin/env node
/**
 * Style check. Enforces the parts of docs/STYLE_GUIDE.md that a grep can catch:
 * banned phrases, em and en dashes, raw palette classes outside the primitives
 * layer, tracked all-caps labels, and arrows in text.
 *
 * Usage: node scripts/style-check.mjs   (exit 1 on any violation)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const roots = ["src", "content"];
const extensions = new Set([".ts", ".tsx", ".md", ".mdx", ".css"]);

const bannedPhrases = [
  "as CDG states",
  "as CDG publishes",
  "as CDG lists",
  "mid-funnel",
  "bottom-of-funnel",
  "hard convert",
  "soft CTA",
  "secondary hard",
  "R=470",
  "tracked link",
  "money page",
];

const rules = [
  {
    name: "banned phrase",
    test: (line) =>
      bannedPhrases.find((p) => line.toLowerCase().includes(p.toLowerCase())),
    applies: (file) => !isLibConfig(file),
  },
  {
    /**
     * Decision 0021 and the voice rules: competitors publish their rates, so
     * the site never says or implies that a fee or a rate is hidden. Catches
     * "hide"/"hidden"/"hides"/"hiding" within a few words of fee, rate,
     * pricing, or cost, in either order.
     */
    name: "hidden fee claim",
    test: (line) => {
      // "hidden" is also a layout utility (hidden sm:inline, sm:hidden), and
      // those carry no claim. Drop class attributes before matching prose.
      const prose = line
        .replace(/class(?:Name)?=(?:"[^"]*"|'[^']*'|\{`[^`]*`\})/g, "")
        .replace(/aria-hidden(?:=(?:"[^"]*"|\{[^}]*\}))?/g, "");
      const m = prose.match(
        /\b(hid(?:e|es|den|ing))\b[^.!?]{0,40}?\b(fees?|rates?|pricing|costs?)\b|\b(fees?|rates?|pricing|costs?)\b[^.!?]{0,40}?\b(hid(?:e|es|den|ing))\b/i,
      );
      return m ? m[0].slice(0, 40) : undefined;
    },
    applies: (file) => !isLibConfig(file),
  },
  {
    name: "em or en dash",
    test: (line) => (/[—–]/.test(line) ? "dash" : undefined),
    applies: () => true,
  },
  {
    name: "raw palette class outside ui/",
    test: (line) => {
      const m = line.match(
        /\b(bg|text|border|ring|outline|divide|from|to|via|fill|stroke|decoration|placeholder)-(teal|slate|amber|emerald|gray|zinc|neutral|stone|white|black)(-\d+)?(\/\d+)?\b/,
      );
      return m ? m[0] : undefined;
    },
    applies: (file) =>
      file.endsWith(".tsx") &&
      !file.includes(`components${sep}ui${sep}`) &&
      !file.endsWith("globals.css"),
  },
  {
    name: "tracked all-caps label",
    test: (line) =>
      /\buppercase\b/.test(line) && /\btracking-/.test(line) ? "uppercase tracking" : undefined,
    applies: (file) => file.endsWith(".tsx"),
  },
  {
    name: "arrow in text",
    test: (line) => (/[→←➔]/.test(line) ? "arrow" : undefined),
    applies: (file) => file.endsWith(".tsx") || file.endsWith(".md"),
  },
];

/** Config files carry URLs with R=470 on purpose. Phrase rule skips them. */
function isLibConfig(file) {
  return file.includes(`src${sep}lib${sep}site.ts`) || file.includes(`src${sep}lib${sep}cta.ts`);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
    } else if ([...extensions].some((ext) => full.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

const files = roots.flatMap((r) => {
  try {
    return walk(join(root, r));
  } catch {
    return [];
  }
});

const violations = [];
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const rule of rules) {
      if (!rule.applies(file)) continue;
      const hit = rule.test(line);
      if (hit) {
        violations.push(
          `${relative(root, file)}:${i + 1}: ${rule.name}: ${String(hit).slice(0, 40)}`,
        );
      }
    }
  });
}

if (violations.length) {
  console.error(`style-check: ${violations.length} violation(s)\n`);
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log(`style-check: ${files.length} files clean`);
