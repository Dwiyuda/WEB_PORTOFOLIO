// Memeriksa setiap pena terhadap setiap lantai, di dua tema, dalam dua
// keadaan: lantai rata dan lantai bertekstur. Titik tergelap motif yang
// menentukan kontras sebenarnya, bukan warna lantainya.
//
// Jalankan: npm run check:contrast
import { readFileSync } from "node:fs";

const CSS = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
const AMBANG = 4.5;

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const Y = (h) => { const [r, g, b] = rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const Lstar = (y) => 116 * (y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116) - 16;
const rasio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

// Ambil satu token dari satu blok selector. Sengaja tidak memakai parser CSS:
// yang dibutuhkan hanya nilai hex, dan dependency baru dilarang.
//
// Dijangkar ke kolom 0 dan menuntut kecocokan TUNGGAL. `:root {` sekarang juga
// muncul di dalam @media print, menjorok dua spasi. indexOf yang lama kebetulan
// menemukan yang benar hanya karena blok token berada di atas blok cetak: kalau
// urutannya pernah bertukar, pemeriksa akan membaca warna cetak — hitam di atas
// putih, lolos semua — dan melaporkan berhasil tanpa suara.
function blok(selector) {
  const pola = new RegExp(
    `^${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{`,
    "gm",
  );
  const cocok = [...CSS.matchAll(pola)];
  if (cocok.length !== 1) {
    throw new Error(
      `blok "${selector}" harus muncul tepat sekali di kolom 0 global.css, ` +
        `ditemukan ${cocok.length}`,
    );
  }
  const akhir = CSS.indexOf("}", cocok[0].index);
  return CSS.slice(cocok[0].index, akhir);
}

function token(selector, nama) {
  const m = blok(selector).match(new RegExp(`--${nama}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --${nama} tidak ada di ${selector}`);
  return m[1];
}

const TEMA = [
  { nama: "terang", sel: ":root" },
  { nama: "gelap", sel: '[data-theme="dark"]' },
];

// Pena diuji di lantai tempat dia benar-benar dipakai, bukan di semua lantai.
// Terakota hanya dipakai di studi kasus audit, yang tinggal di lantai 2, dan
// PRD melarangnya berada di lantai 4. Menuntutnya lolos di lantai 4 berarti
// menguji sesuatu yang sudah dilarang, lalu memperdalam warnanya tanpa alasan.
const PENA = [
  { nama: "pen", lantai: [1, 2, 3, 4] },
  { nama: "pen-soft", lantai: [1, 2, 3, 4] },
  { nama: "verified", lantai: [1, 2, 3, 4] },
  { nama: "before-audit", lantai: [2] },
];

let gagal = 0;
let diperiksa = 0;

for (const { nama, sel } of TEMA) {
  console.log(`\n${nama.toUpperCase()}`);
  for (let n = 1; n <= 4; n++) {
    const lantai = token(sel, `rung-${n}`);
    const motif = token(sel, `motif-${n}`);
    const dL = Math.abs(Lstar(Y(lantai)) - Lstar(Y(motif)));

    if (dL > 3.2) {
      console.log(`  lantai ${n}  MOTIF TERLALU KUAT  dL* ${dL.toFixed(2)} > 3,2`);
      gagal++;
    }

    for (const p of PENA) {
      if (!p.lantai.includes(n)) continue;
      const warna = token(sel, p.nama);
      // Yang dihitung yang terburuk dari dua keadaan lantai: rata dan bertekstur.
      const r = Math.min(rasio(Y(lantai), Y(warna)), rasio(Y(motif), Y(warna)));
      diperiksa++;
      const lolos = r >= AMBANG;
      if (!lolos) gagal++;
      console.log(
        `  lantai ${n} ${lantai}  ${p.nama.padEnd(12)} ${warna}  ${r.toFixed(2)}:1  ${lolos ? "ok" : "GAGAL"}`,
      );
    }
  }
}

// Bukan pemeriksaan, tapi pengingat yang dicetak tiap kali skrip jalan.
// Angkanya lolos ambang dengan margin 0,0004 — itu bukan lolos, itu kebetulan.
// Karena itu terakota tidak diuji di lantai 4, dan tidak boleh ditaruh di sana:
// perubahan sekecil apa pun pada motif atau terakota akan menjatuhkannya
// tanpa suara.
const r4 = rasio(Y(token(":root", "motif-4")), Y(token(":root", "before-audit")));
console.log(
  `\nCatatan: terakota di lantai 4 bertekstur = ${r4.toFixed(4)}:1, ` +
    `margin ${(r4 - AMBANG).toFixed(4)} di atas ambang.\n` +
    `Margin sekecil itu bukan keamanan. Studi kasus audit wajib tetap di ` +
    `lantai 2, tempat angkanya 6,23:1. Jangan dipindahkan.`,
);

console.log(`\n${diperiksa} kombinasi diperiksa, ${gagal} gagal.`);
process.exit(gagal > 0 ? 1 : 0);
