// assets/background.jpeg → src/assets/motif-tile.webp
//
// Berkas sumbernya wallpaper ponsel 736x1472: tepinya tidak menyambung dan
// ada vignette halus di kiri-kanan, jadi tidak bisa langsung diubin.
//
// Tiga hal yang dikerjakan:
//   1. Ambil satu satuan ulang 368x368 dari tengah, menjauhi vignette.
//   2. Cerminkan jadi 736x736. Ubin bercermin selalu tanpa jahitan menurut
//      konstruksinya. Simetri cerminnya tidak terlihat karena pada ΔL* 1,5
//      motifnya nyaris tak terlihat.
//   3. Normalisasi. Sumbernya cuma memakai 0-55 dari 255, jadi tanpa
//      peregangan polanya hampir hilang begitu dipakai sebagai alfa.
//
// Polanya ditulis ke kanal ALFA, bukan luminance: mask-image memakai alfa
// secara baku di semua peramban, sedangkan mask-mode: luminance dukungannya
// belum merata.
//
// Jalankan: node scripts/prep-texture.mjs
import sharp from "sharp";
import { statSync } from "node:fs";

const SUMBER = new URL("../assets/background.jpeg", import.meta.url).pathname.slice(1);
const KELUARAN = new URL("../src/assets/motif-tile.webp", import.meta.url).pathname.slice(1);

const UNIT = 368;
const KIRI = Math.round((736 - UNIT) / 2);
const ATAS = 300;

const unit = await sharp(SUMBER)
  .extract({ left: KIRI, top: ATAS, width: UNIT, height: UNIT })
  .greyscale()
  .normalise()
  .toBuffer();

const cermin = async (flip, flop) =>
  sharp(unit).flip(flip).flop(flop).toBuffer();

const pola = await sharp({
  create: { width: UNIT * 2, height: UNIT * 2, channels: 3, background: { r: 0, g: 0, b: 0 } },
})
  .composite([
    { input: unit, left: 0, top: 0 },
    { input: await cermin(false, true), left: UNIT, top: 0 },
    { input: await cermin(true, false), left: 0, top: UNIT },
    { input: await cermin(true, true), left: UNIT, top: UNIT },
  ])
  .png()
  .toBuffer();

// Putih penuh, dengan polanya sebagai alfa. Warnanya nanti datang dari
// --motif lewat CSS, jadi satu berkas melayani delapan lantai.
await sharp({
  create: { width: UNIT * 2, height: UNIT * 2, channels: 3, background: "#ffffff" },
})
  .joinChannel(await sharp(pola).greyscale().raw().toBuffer(), {
    raw: { width: UNIT * 2, height: UNIT * 2, channels: 1 },
  })
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile(KELUARAN);

const m = await sharp(KELUARAN).metadata();
const ukuran = statSync(KELUARAN).size;
console.log(`motif-tile.webp  ${m.width}x${m.height}  ${(ukuran / 1024).toFixed(1)} KB  alfa: ${m.hasAlpha}`);
