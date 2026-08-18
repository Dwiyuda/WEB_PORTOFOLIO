// Melempar setiap permintaan ke *.pages.dev menuju domain resmi.
//
// dwiyuda.is-a.dev adalah alamat resmi sejak 18 Agustus 2026, tapi Cloudflare
// tidak menyediakan cara mematikan subdomain *.pages.dev — dia tidak bisa
// diubah maupun dinonaktifkan dari dashboard. Tanpa ini situs yang sama bisa
// diakses dari dua alamat, dan `canonical` cuma memberi tahu mesin pencari,
// tidak mengarahkan manusia.
//
// 301 dipilih, bukan 302, supaya mesin pencari memindahkan bobotnya secara
// permanen. Tautan pages.dev yang sudah tersebar tetap berfungsi: pembaca
// dialihkan, bukan dibuang ke halaman mati.
//
// Berjalan di edge Cloudflare, jadi build tetap tidak mengirim JavaScript apa
// pun ke peramban. Alternatifnya skrip di sisi klien, yang menambah JS,
// berkedip lebih dulu, dan bisa dilewati begitu saja.
//
// Harga yang dibayar, supaya tercatat: `_middleware.js` dijalankan pada SETIAP
// permintaan, termasuk font, gambar, dan CSS — bukan cuma halaman HTML. Jadi
// tiap aset kini melewati Worker sebelum dilayani. Logikanya satu perbandingan
// string dan jalur normalnya langsung `next()`, jadi tambahan latensinya
// sepersekian milidetik, tapi ini bukan nol. Kalau suatu hari trafiknya besar
// atau butuh benar-benar nol overhead, jalan keluarnya menghapus berkas ini dan
// kembali mengandalkan `canonical` saja — mesin pencari sudah diarahkan ke
// dwiyuda.is-a.dev sejak commit ab42a68.
//
// `_redirects` tidak bisa dipakai untuk ini: berkas itu tidak mengenal kondisi
// hostname. Bulk Redirects juga tidak, karena pages.dev bukan zona milik kita.
export const onRequest = ({ request, next }) => {
  const url = new URL(request.url);

  // Cocok TEPAT, bukan `endsWith(".pages.dev")`. Preview deployment beralamat
  // <hash>.dwiyuda.pages.dev, dan mengalihkannya ke produksi akan membuat
  // preview jadi tidak berguna — justru itu satu-satunya cara meninjau branch
  // sebelum digabung. Yang dialihkan hanya alias produksi yang publik.
  if (url.hostname === "dwiyuda.pages.dev") {
    url.hostname = "dwiyuda.is-a.dev";
    // Path, query, dan fragment ikut terbawa, jadi tautan dalam ke bagian
    // tertentu tetap mendarat di tempat yang benar.
    return Response.redirect(url.toString(), 301);
  }

  return next();
};
