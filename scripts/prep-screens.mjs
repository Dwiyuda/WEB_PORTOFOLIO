// Menyiapkan tangkapan layar KTM Detector untuk ditayangkan.
//
// Tangkapan aslinya memuat kartu identitas milik orang lain: nama, NPM,
// tanggal lahir, dan foto wajah. Satu di antaranya bahkan memuat KTP
// lengkap dengan NIK, dan berkas itu tidak dipakai sama sekali.
//
// Yang dipakai di sini dipotong ke panel antarmukanya, dan setiap area
// yang memuat kartu diburamkan sampai teksnya tidak terbaca. Pola warna
// Grad-CAM tetap terlihat karena itu yang perlu dilihat pembaca.
import sharp from "sharp";

// Memburamkan sebagian gambar: potong areanya, buramkan, tempel kembali.
async function blurRegions(input, regions, sigma = 14) {
  const base = sharp(input);
  const { width, height } = await base.metadata();
  const patches = await Promise.all(
    regions.map(async (r) => ({
      input: await sharp(input)
        .extract({ left: r.left, top: r.top, width: r.width, height: r.height })
        .blur(sigma)
        .toBuffer(),
      left: r.left,
      top: r.top,
    })),
  );
  return sharp(input).composite(patches).toBuffer();
}

const jobs = [
  {
    // Hasil ASLI dengan tingkat keyakinan. Tidak ada kartu di bingkai ini,
    // jadi tidak perlu diburamkan.
    src: "assets/Screenshot 2026-07-05 233324.png",
    out: "src/assets/detector-accepted.jpg",
    crop: { left: 344, top: 0, width: 1134, height: 620 },
    blur: [],
  },
  {
    // Gerbang menolak gambar karena keyakinan di bawah ambang 85%.
    // Tiga thumbnail kartu di bagian atas diburamkan.
    src: "assets/Screenshot 2026-07-05 233754.png",
    out: "src/assets/detector-rejected.jpg",
    // Tinggi harus sampai ke baris REAL/FAKE di bawah ambang; itu bagian
    // yang membuktikan gerbangnya menolak, bukan sekadar ragu.
    crop: { left: 344, top: 90, width: 1134, height: 750 },
    blur: [{ left: 60, top: 0, width: 720, height: 125 }],
  },
  {
    // Grad-CAM. Kedua kartu diburamkan; peta panasnya tetap terbaca
    // sebagai pola, dan itu yang jadi isi gambarnya.
    // Sumbernya 1476 lebar, jadi crop tidak boleh melewati 1476-380.
    src: "assets/Screenshot 2026-07-06 000500.png",
    out: "src/assets/detector-gradcam.jpg",
    crop: { left: 380, top: 150, width: 1090, height: 520 },
    blur: [
      { left: 25, top: 192, width: 315, height: 150 },
      { left: 350, top: 192, width: 315, height: 150 },
    ],
  },
];

for (const job of jobs) {
  const cropped = await sharp(job.src).extract(job.crop).toBuffer();
  const redacted = job.blur.length
    ? await blurRegions(cropped, job.blur)
    : cropped;

  const info = await sharp(redacted)
    .resize(1100, null, { withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(job.out);

  console.log(
    `${job.out.padEnd(36)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB  (${job.blur.length} area diburamkan)`,
  );
}
