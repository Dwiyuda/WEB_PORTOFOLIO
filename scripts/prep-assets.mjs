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

// Kedua tangkapan APBDes aslinya slide presentasi lengkap dengan judul
// "Tampilan Website Sebelum/Setelah Update" dan footer kampus. Di dalam
// penggeser, judul slide itulah yang terbaca dan membuat kedua sisi tampak
// sama-sama "sebelum". Header dan footernya dipotong dengan angka yang sama
// persis untuk keduanya, supaya sisi kiri dan kanan tetap sejajar.
const slideCrop = { top: 0.088, bottom: 0.9, left: 0.02, right: 0.98 };
const lampiran = "D:/History/Lampiran/Profil Dwi Yuda";

jobs.push(
  {
    in: `${lampiran}/Profil Dwi Yuda - APBDes Sebelum.jpg`,
    out: "src/assets/apbdes-before.jpg",
    width: 1400,
    ratio: 2880 / 1370,
    position: "centre",
    crop: slideCrop,
  },
  {
    in: `${lampiran}/Profil Dwi Yuda - APBDes Sesudah.jpg`,
    out: "src/assets/apbdes-after.jpg",
    width: 1400,
    ratio: 2880 / 1370,
    position: "centre",
    crop: slideCrop,
  },
);

for (const job of jobs) {
  const meta = await sharp(job.in).metadata();
  const height = Math.round(job.width / job.ratio);

  let pipe = sharp(job.in);

  if (job.crop) {
    const c = job.crop;
    pipe = pipe.extract({
      left: Math.round(meta.width * c.left),
      top: Math.round(meta.height * c.top),
      width: Math.round(meta.width * (c.right - c.left)),
      height: Math.round(meta.height * (c.bottom - c.top)),
    });
  }

  const info = await pipe
    .resize(job.width, height, { fit: "cover", position: job.position })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(job.out);

  console.log(
    `${job.out.padEnd(34)} ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`,
  );
}
