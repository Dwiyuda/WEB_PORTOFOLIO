// Menyiapkan berkas dari assets/ menjadi aset situs di src/assets/.
// Sumbernya foto kamera 7-10 MB dengan rasio bermacam-macam, jadi dipotong
// ke rasio yang dipakai tata letak lalu diperkecil sebelum masuk repo.
// Astro tetap yang mengurus WebP dan srcset saat build.
import sharp from "sharp";

const jobs = [
  {
    // Sumbernya hanya 528x584, jadi jangan diperbesar. Dipotong ke 4:5 pada
    // resolusi aslinya; hero menampilkannya pada 14rem, masih di atas 2x.
    in: "assets/Hero2.png",
    out: "src/assets/portrait.jpg",
    width: 467,
    ratio: 4 / 5,
    position: "top",
  },
  {
    in: "assets/Dokumentasi_HIMATIF_GoesToSchool.JPG",
    out: "src/assets/goes-to-school.jpg",
    width: 1400,
    ratio: 16 / 10,
    position: "centre",
  },
  {
    in: "assets/KBM.JPG",
    out: "src/assets/induction-camp.jpg",
    width: 1400,
    ratio: 16 / 10,
    position: "centre",
  },
  {
    in: "assets/Dokumentasi_Desa_Pulau_Gadang_Bag.Keuangan.jpg",
    out: "src/assets/village-finance.jpg",
    width: 1200,
    ratio: 16 / 10,
    position: "centre",
  },
  {
    in: "assets/Dokumentasi_PulauGadang_Presentasi2.jpeg",
    out: "src/assets/village-presentation.jpg",
    width: 1200,
    ratio: 16 / 10,
    position: "centre",
  },
];

for (const job of jobs) {
  const meta = await sharp(job.in).metadata();
  const height = Math.round(job.width / job.ratio);

  const info = await sharp(job.in)
    .resize(job.width, height, { fit: "cover", position: job.position })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(job.out);

  console.log(
    `${job.out.padEnd(34)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`,
  );
}
