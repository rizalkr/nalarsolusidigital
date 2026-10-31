# Draf Copy — Penambahan Informasi Web Nalar Solusi Digital

Dibuat: 31 Okt 2026. Status: DRAF untuk review Rizal — belum diterapkan ke repo.
Gaya: Bahasa Indonesia, edukatif, understand-before-offering, tanpa hard-selling.
Tidak ada klaim harga, tahun berdiri, jumlah klien, atau testimoni (tidak terverifikasi).
Cakupan: 3 bagian (A: email bisnis, B: kontak, C: FAQ). Section demo TIDAK diubah — sudah lengkap (Rizal, 31 Okt).

---

## KONFIGURASI (dibaca dari env — nilai hanya di lokal/VPS; di prompt/dokumen cukup sebut nama variabelnya)
- NEXT_PUBLIC_WHATSAPP_NUMBER → tampil format 0815-2996-4902, link wa.me/<nilai>
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_DEMO_KONVEKSI_URL
- NEXT_PUBLIC_DEMO_RENTAL_URL
- NEXT_PUBLIC_CONTACT_EMAIL → email domain, sudah diset di VPS (Rizal, 31 Okt)

---

## A. Section Email Bisnis — DIPERKUAT
**Penempatan:** menggantikan blurb singkat "Email Bisnis" + melengkapi "Identitas dan Infrastruktur Digital" di Area Solusi.

**Judul:** Email Bisnis: Kecil, Tapi Sering Jadi Penentu

**Copy:**
> Alamat email adalah hal pertama yang dilihat calon pelanggan dan mitra dari bisnis Anda. Email dengan domain perusahaan sendiri memberi tiga hal sekaligus:
>
> **1. Kredibilitas instan.** `nama@usahaanda.com` terlihat jauh lebih serius daripada `usahaanda123@gmail.com` — terutama di mata pelanggan baru dan mitra korporat.
>
> **2. Aset yang tinggal.** Email tetap milik usaha meski karyawan berganti. Tidak ada lagi kontak pelanggan yang ikut pergi bersama mantan admin.
>
> **3. Alamat per fungsi.** Pisahkan urusan dengan rapi: `cs@` untuk layanan pelanggan, `order@` untuk pemesanan, `keuangan@` untuk administrasi.
>
> **Penting untuk diketahui:** usaha yang mengikuti pengadaan barang/jasa pemerintah (LPSE/SPSE) wajib menggunakan email resmi perusahaan sebagai syarat administrasi. Tanpa email domain sendiri, proses pendaftaran bisa terhenti sebelum mulai.
>
> Kami bantu menyiapkan email bisnis Anda dari nol — domain, pengaturan, sampai siap dipakai.

**CTA:** [Tanya tentang email bisnis →] (link WhatsApp)

---

## B. Section Kontak — BARU
**Penempatan:** section sendiri, setelah "Langkah Selanjutnya" / sebelum footer. (Tombol "Konsultasi Gratis" yang sudah ada tetap.)

**Judul:** Mulai Percakapan

**Copy:**
> Ceritakan usaha Anda — jenis usaha, kendala yang dihadapi, dan hal yang ingin diperbaiki. Kami akan merespons dan mendiskusikan pendekatan yang paling masuk akal untuk kebutuhan Anda, tanpa komitmen apa pun.
>
> **WhatsApp:** 0815-2996-4902 → [Chat WhatsApp](link wa.me dari env, dengan teks prefill)
> **Email:** info@nalarsolusidigital.my.id → [Kirim email](mailto dari env)
> **Lokasi:** Klaten, Jawa Tengah — melayani konsultasi online untuk seluruh Indonesia.

**Catatan kecil:** teks prefill tombol WhatsApp yang sekarang ("...kebutuhan website usaha saya") sebaiknya diganti menjadi "...kebutuhan digital usaha saya" agar selaras dengan positioning (Nalar tidak hanya website).

---

## C. FAQ — BARU
**Penempatan:** setelah "Pendekatan Kami", sebelum "Langkah Selanjutnya".

**Judul:** Pertanyaan yang Sering Ditanyakan

**1. Apakah setiap usaha butuh website?**
Tidak. Itulah kenapa kami selalu mulai dari memahami kebutuhan Anda dulu. Kadang yang paling masuk akal adalah katalog digital, kadang merapikan administrasi, kadang memang website. Kami akan bilang terus terang kalau usaha Anda belum membutuhkannya.

**2. Bagaimana biayanya ditentukan?**
Setelah diskusi kebutuhan. Tidak ada paket harga kaku — ruang lingkup dan estimasi kami susun berdasarkan apa yang benar-benar Anda butuhkan, lalu disepakati bersama sebelum pengerjaan dimulai.

**3. Berapa lama pengerjaannya?**
Tergantung ruang lingkupnya. Estimasi waktu kami sampaikan di awal, setelah kebutuhan dipetakan — dan menjadi bagian dari kesepakatan sebelum kami mulai.

**4. Apa yang perlu saya siapkan?**
Cukup cerita tentang usaha Anda dan kendalanya. Jika ada materi seperti logo atau foto produk, itu membantu — tapi kalaupun belum ada, kami pandu langkahnya.

**5. Apakah bisa dikerjakan bertahap?**
Bisa. Justru itu yang sering paling masuk akal: mulai dari kebutuhan paling mendesak (misalnya katalog digital), kembangkan ke tahap berikutnya setelahnya.

**6. Apakah melayani di luar Klaten?**
Kami berbasis di Klaten, Jawa Tengah, dan melayani konsultasi secara online untuk seluruh Indonesia.

---

## Catatan implementasi (untuk nanti)
- Repo: `rizalkr/nalarsolusidigital` (tidak ada standing approval — setiap write butuh approval card).
- Ikuti skill anti-slop-design + frontend-design saat implementasi.
- Setelah copy disetujui, kerjakan per section dalam branch + PR (pola yang sudah berjalan).
