// Mengunduh subset latin tiga muka huruf ke public/fonts/.
// Dijalankan sekali dengan tangan, bukan bagian dari build — hasilnya
// di-commit supaya build tidak pernah bergantung pada jaringan.
//
// Jalankan: node scripts/fetch-fonts.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const FONTS = [
  { q: "Bricolage+Grotesque:opsz,wght@12..96,400..800", file: "bricolage-grotesque.woff2" },
  { q: "Literata:opsz,wght@7..72,400..700", file: "literata.woff2" },
  { q: "JetBrains+Mono:wght@400..600", file: "jetbrains-mono.woff2" },
];

// Blok @font-face yang unicode-range-nya memuat U+0000-00FF adalah subset latin.
function urlLatin(css) {
  for (const b of css.split("@font-face").slice(1)) {
    if (!/U\+0000-00FF/.test(b)) continue;
    const m = b.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
    if (m) return m[1];
  }
  throw new Error("subset latin tidak ditemukan");
}

mkdirSync(new URL("../public/fonts/", import.meta.url), { recursive: true });

for (const f of FONTS) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${f.q}&display=swap`, {
      headers: { "User-Agent": UA },
    })
  ).text();
  const buf = Buffer.from(await (await fetch(urlLatin(css), { headers: { "User-Agent": UA } })).arrayBuffer());
  writeFileSync(new URL(`../public/fonts/${f.file}`, import.meta.url), buf);
  console.log(`${f.file.padEnd(28)} ${(buf.length / 1024).toFixed(1)} KB`);
}
