// Render kartu pratinjau 1200x630 dari SVG memakai sharp yang sudah ikut
// terpasang bersama Astro. Dijalankan sekali, hasilnya di-commit.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#14181C"/>
  <rect x="0" y="0" width="1200" height="4" fill="#0E6E5C"/>

  <circle cx="88" cy="92" r="11" fill="#0E6E5C"/>

  <text x="120" y="99" font-family="Georgia, 'Times New Roman', serif" font-size="21" fill="#9AA2A5" letter-spacing="3">DWIYUDA.IS-A.DEV</text>

  <text x="88" y="286" font-family="Georgia, 'Times New Roman', serif" font-size="128" font-weight="bold" fill="#FAF9F5" letter-spacing="-4">Dwi Yuda</text>

  <text x="88" y="368" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="#E8E6E0">I audit my own work before</text>
  <text x="88" y="420" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="#E8E6E0">someone else has to.</text>

  <rect x="88" y="480" width="1024" height="1" fill="#2B3133"/>

  <text x="88" y="546" font-family="monospace" font-size="34" fill="#FAF9F5">1,645</text>
  <text x="88" y="580" font-family="monospace" font-size="19" fill="#9AA2A5">images</text>

  <text x="358" y="546" font-family="monospace" font-size="34" fill="#FAF9F5">~300</text>
  <text x="358" y="580" font-family="monospace" font-size="19" fill="#9AA2A5">undergraduates</text>

  <text x="688" y="546" font-family="monospace" font-size="34" fill="#FAF9F5">4</text>
  <text x="688" y="580" font-family="monospace" font-size="19" fill="#9AA2A5">years, no repeats</text>

  <text x="1008" y="546" font-family="monospace" font-size="34" fill="#4FBFA3">A</text>
  <text x="1008" y="580" font-family="monospace" font-size="19" fill="#9AA2A5">thesis grade</text>
</svg>`;

const out = process.argv[2];
const buf = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(out, buf);
console.log(`wrote ${out}, ${Math.round(buf.length / 1024)} KB`);
