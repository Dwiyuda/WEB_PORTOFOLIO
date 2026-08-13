// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Domain tujuan akhir. Dipakai untuk canonical dan og:url, supaya tautan
  // yang dibagikan menunjuk ke sini walau situsnya juga hidup di pages.dev.
  site: 'https://dwiyuda.is-a.dev',
});
