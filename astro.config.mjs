// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Harus alamat yang BENAR-BENAR hidup, bukan yang dituju.
  //
  // Nilai ini mengisi canonical, og:url, dan og:image. Diarahkan ke
  // dwiyuda.is-a.dev pada 18 Agustus 2026, setelah PR is-a-dev/register #47149
  // di-merge, domainnya ditambahkan sebagai custom domain di Cloudflare Pages
  // lewat API (dashboard menolak karena is-a.dev ada di Public Suffix List),
  // dan https://dwiyuda.is-a.dev/og.png sudah membalas 200. Urutan itu penting:
  // mengganti nilai ini sebelum domainnya hidup membuat og:image menunjuk URL
  // mati dan pratinjau tautan di WhatsApp serta LinkedIn kosong.
  //
  // dwiyuda.pages.dev tetap hidup, jadi tautan lama tidak rusak.
  site: 'https://dwiyuda.is-a.dev',
});
