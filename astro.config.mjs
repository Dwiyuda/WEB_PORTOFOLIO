// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Harus alamat yang BENAR-BENAR hidup, bukan yang dituju.
  //
  // Nilai ini mengisi canonical, og:url, dan og:image. Sempat diarahkan ke
  // dwiyuda.is-a.dev sebelum PR domainnya di-merge, dan akibatnya og:image
  // menunjuk URL yang masih 302 sehingga pratinjau tautan di WhatsApp dan
  // LinkedIn kosong.
  //
  // Ganti ke 'https://dwiyuda.is-a.dev' setelah PR is-a-dev/register #47149
  // di-merge DAN domainnya sudah ditambahkan sebagai custom domain di
  // Cloudflare Pages. Pastikan https://dwiyuda.is-a.dev/og.png membalas 200
  // lebih dulu.
  site: 'https://dwiyuda.pages.dev',
});
