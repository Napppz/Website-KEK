import { PrismaClient, Role, KekStatus, ContentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding data development KEK Indonesia Portal...");

  // 1. Bersihkan data development lama (opsional jika sudah ada)
  await prisma.investment.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.report.deleteMany();
  await prisma.document.deleteMany();
  await prisma.news.deleteMany();
  await prisma.newsCategory.deleteMany();
  await prisma.kEK.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Data lama berhasil dibersihkan.");

  // 2. Seed Users
  const passwordHash = await bcrypt.hash("AdminKEK2026!", 10);
  const editorPasswordHash = await bcrypt.hash("EditorKEK2026!", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "Administrator Portal KEK",
      email: "admin@kek.go.id",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      name: "Tim Redaksi & Publikasi KEK",
      email: "redaksi@kek.go.id",
      passwordHash: editorPasswordHash,
      role: Role.EDITOR,
    },
  });

  console.log("👤 Pengguna development berhasil dibuat (admin@kek.go.id & redaksi@kek.go.id)");

  // 3. Seed KEK (Kawasan Ekonomi Khusus)
  const kekData = [
    {
      name: "KEK Sei Mangkei",
      slug: "kek-sei-mangkei",
      description:
        "Kawasan Ekonomi Khusus Sei Mangkei berlokasi di Kabupaten Simalungun, Sumatera Utara, difokuskan pada hilirisasi kelapa sawit dan karet terintegrasi ramah lingkungan dengan fasilitas pelabuhan hub terhubung.",
      province: "Sumatera Utara",
      city: "Kabupaten Simalungun",
      address: "Jl. Akses KEK Sei Mangkei, Bosar Maligas, Simalungun, Sumatera Utara 21183",
      area: 2002.77,
      focus: "Hilirisasi Kelapa Sawit, Karet, Oleokimia & Logistik",
      status: KekStatus.BEROPERASI,
      latitude: 3.1258,
      longitude: 99.3496,
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "KEK Kendal",
      slug: "kek-kendal",
      description:
        "KEK Kendal merupakan kawasan industri modern hasil kerjasama bilateral strategis yang ditujukan bagi manufaktur berteknologi tinggi, industri otomotif, tekstil terpadu, dan elektronik.",
      province: "Jawa Tengah",
      city: "Kabupaten Kendal",
      address: "Kawasan Industri Kendal, Jl. Arteri Kaliwungu No. 39, Kendal, Jawa Tengah 51372",
      area: 1000.0,
      focus: "Manufaktur, Elektronik, Komponen Otomotif, Tekstil & Busana Ekspor",
      status: KekStatus.BEROPERASI,
      latitude: -6.9531,
      longitude: 110.2789,
      imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "KEK Mandalika",
      slug: "kek-mandalika",
      description:
        "Pusat pariwisata berkelanjutan kelas dunia berbasis sport tourism terintegrasi sirkuit internasional, resort mewah berorientasi kearifan lokal, dan fasilitas hiburan pesisir selatan Lombok.",
      province: "Nusa Tenggara Barat",
      city: "Kabupaten Lombok Tengah",
      address: "Kuta, Pujut, Kabupaten Lombok Tengah, Nusa Tenggara Barat 83573",
      area: 1035.67,
      focus: "Sport Tourism, Eco-Resort, MICE, Kebudayaan Sasak & Wisata Bahari",
      status: KekStatus.BEROPERASI,
      latitude: -8.8953,
      longitude: 116.2953,
      imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "KEK Nongsa",
      slug: "kek-nongsa-digital-park",
      description:
        "Pusat ekonomi digital dan jembatan talenta teknologi antara Indonesia dan ekosistem digital global. Menampung data center hyperscale bertaraf internasional, studio animasi, dan pusat riset software.",
      province: "Kepulauan Riau",
      city: "Kota Batam",
      address: "Jl. Hang Lekiu, Sambau, Nongsa, Kota Batam, Kepulauan Riau 29465",
      area: 166.45,
      focus: "Ekonomi Digital, Data Center Hyperscale, Creative Industry & Software R&D",
      status: KekStatus.BEROPERASI,
      latitude: 1.1783,
      longitude: 104.0988,
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "KEK Sanur",
      slug: "kek-sanur",
      description:
        "KEK Kesehatan pertama di Indonesia yang memadukan layanan medis berstandar internasional, pusat kebugaran dan regenerasi, serta rumah sakit bertaraf global di kawasan pariwisata ikonik Sanur.",
      province: "Bali",
      city: "Kota Denpasar",
      address: "Jl. Hang Tuah, Sanur Kaja, Denpasar Selatan, Kota Denpasar, Bali 80227",
      area: 41.26,
      focus: "Pariwisata Kesehatan, Rumah Sakit Internasional, Wellness & Estetika Medis",
      status: KekStatus.BEROPERASI,
      latitude: -8.6753,
      longitude: 115.2631,
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "KEK Morotai",
      slug: "kek-morotai",
      description:
        "Sentra pengembangan industri perikanan tangkap modern, logistik pasifik utara, pengolahan hasil laut terpadu, dan pariwisata bahari sejarah kepulauan Morotai.",
      province: "Maluku Utara",
      city: "Kabupaten Pulau Morotai",
      address: "Kecamatan Morotai Selatan, Kabupaten Pulau Morotai, Maluku Utara 97771",
      area: 1101.76,
      focus: "Industri Perikanan Terpadu, Logistik Samudera Pasifik & Pariwisata Sejarah",
      status: KekStatus.TAHAP_PEMBANGUNAN,
      latitude: 2.0524,
      longitude: 128.2981,
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "KEK Sorong",
      slug: "kek-sorong",
      description:
        "Gerbang industri dan logistik kawasan timur Indonesia yang mengintegrasikan pengolahan hasil hutan berkelanjutan, mineral nikel, dan rantai pasok maritim komoditas unggulan Papua.",
      province: "Papua Barat Daya",
      city: "Kabupaten Sorong",
      address: "Distrik Mayamuk, Kabupaten Sorong, Papua Barat Daya 98453",
      area: 523.7,
      focus: "Industri Pengolahan Mineral, Hasil Hutan, Logistik Maritim & Galangan Kapal",
      status: KekStatus.TAHAP_PEMBANGUNAN,
      latitude: -0.9984,
      longitude: 131.3284,
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const createdKeks = [];
  for (const item of kekData) {
    const kek = await prisma.kEK.create({ data: item });
    createdKeks.push(kek);
  }
  console.log(`🏭 ${createdKeks.length} data KEK development berhasil dibuat.`);

  // 4. Seed News Categories
  const categoriesData = [
    { name: "Siaran Pers", slug: "siaran-pers" },
    { name: "Investasi & Bisnis", slug: "investasi-dan-bisnis" },
    { name: "Pembangunan Kawasan", slug: "pembangunan-kawasan" },
    { name: "Kerjasama Bilateral", slug: "kerjasama-bilateral" },
    { name: "Kebijakan & Regulasi", slug: "kebijakan-dan-regulasi" },
  ];

  const createdCategories = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.newsCategory.create({ data: cat });
    createdCategories.push(createdCat);
  }
  console.log(`🏷️ ${createdCategories.length} kategori berita berhasil dibuat.`);

  // 5. Seed News
  const newsData = [
    {
      title: "Pemerintah Tingkatkan Efisiensi Layanan Perizinan Tunggal di Seluruh Kawasan Ekonomi Khusus",
      slug: "pemerintah-tingkatkan-efisiensi-layanan-perizinan-tunggal-kek",
      excerpt:
        "Integrasi sistem OSS dengan administrator KEK terus dimutakhirkan guna memberikan kepastian hukum dan percepatan realisasi investasi para penanam modal dalam dan luar negeri.",
      content:
        "<p>Pemerintah Republik Indonesia terus berkomitmen memperkuat daya saing kawasan ekonomi khusus melalui akselerasi digitalisasi perizinan terpadu satu pintu. Fasilitas fiskal maupun non-fiskal yang ditawarkan kini dapat diproses lebih transparan dan akuntabel.</p><p>Langkah ini disambut positif oleh berbagai asosiasi penanaman modal yang menilai bahwa kepastian waktu adalah faktor kunci dalam pemilihan lokasi ekspansi pabrik manufaktur dan infrastruktur teknologi.</p>",
      thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      authorId: adminUser.id,
      categoryId: createdCategories[0].id,
      kekId: createdKeks[1].id, // Kendal
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-03-15T09:00:00Z"),
    },
    {
      title: "KEK Nongsa Digital Park Perkuat Posisi Indonesia sebagai Hub Pusat Data Ramah Lingkungan",
      slug: "kek-nongsa-digital-park-perkuat-posisi-indonesia-hub-data-center",
      excerpt:
        "Kapasitas energi terbarukan dan konektivitas kabel bawah laut menjadikan Batam sebagai pusat komputasi awan strategis regional Asia Tenggara.",
      content:
        "<p>Pengembangan klaster pusat data (data center) berstandar tier 3 dan 4 di KEK Nongsa Batam terus melaju pesat. Sejumlah perusahaan teknologi global telah memulai konstruksi fasilitas komputasi berteknologi pendingin hemat energi.</p><p>Kawasan ini juga menyelenggarakan program inkubasi talenta pemrograman dan rekayasa kecerdasan buatan bagi generasi muda Indonesia.</p>",
      thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      authorId: editorUser.id,
      categoryId: createdCategories[1].id,
      kekId: createdKeks[3].id, // Nongsa
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-03-10T14:30:00Z"),
    },
    {
      title: "Transformasi Wisata Kesehatan KEK Sanur Siap Melayani Pasien Regional",
      slug: "transformasi-wisata-kesehatan-kek-sanur-layani-pasien-regional",
      excerpt:
        "Fasilitas rumah sakit bertaraf internasional di Sanur mengintegrasikan teknologi medis canggih dengan pemulihan alami tepi pantai Bali.",
      content:
        "<p>Pembangunan infrastruktur KEK Sanur telah mencapai tonggak sejarah penting. Dengan bergabungnya para spesialis terkemuka dunia di bidang kardiologi, onkologi, dan regenerative medicine, masyarakat tidak lagi perlu bepergian ke luar negeri untuk mendapatkan perawatan kesehatan premium.</p>",
      thumbnailUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      authorId: editorUser.id,
      categoryId: createdCategories[2].id,
      kekId: createdKeks[4].id, // Sanur
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-02-28T10:00:00Z"),
    },
  ];

  for (const newsItem of newsData) {
    await prisma.news.create({ data: newsItem });
  }
  console.log(`📰 ${newsData.length} data berita development berhasil dibuat.`);

  // 6. Seed Documents (JDIH)
  const documentsData = [
    {
      title: "Peraturan Pemerintah Republik Indonesia Nomor 40 Tahun 2021 tentang Penyelenggaraan Kawasan Ekonomi Khusus",
      documentNumber: "PP No. 40 Tahun 2021",
      year: 2021,
      category: "Peraturan Pemerintah",
      description: "Regulasi komprehensif pedoman tata kelola, fasilitas perpajakan, kepabeanan, ketenagakerjaan, dan kemudahan berusaha di Kawasan Ekonomi Khusus Indonesia.",
      fileUrl: "/documents/pp-no-40-tahun-2021.pdf",
      publishedAt: new Date("2021-02-02"),
    },
    {
      title: "Peraturan Menteri Keuangan Nomor 237/PMK.010/2020 tentang Perlakuan Perpajakan, Kepabeanan, dan Cukai pada Kawasan Ekonomi Khusus",
      documentNumber: "PMK No. 237/PMK.010/2020",
      year: 2020,
      category: "Peraturan Menteri Keuangan",
      description: "Tata cara pemberian insentif Tax Holiday, Tax Allowance, pembebasan Bea Masuk, dan fasilitas PPN di lingkungan KEK.",
      fileUrl: "/documents/pmk-237-tahun-2020.pdf",
      publishedAt: new Date("2020-12-30"),
    },
    {
      title: "Keputusan Presiden tentang Penetapan Kawasan Ekonomi Khusus Kendal",
      documentNumber: "Keppres No. 31 Tahun 2019",
      year: 2019,
      category: "Keputusan Presiden",
      description: "Penetapan zona industri strategis dan batas koordinat wilayah KEK Kendal di Provinsi Jawa Tengah.",
      fileUrl: "/documents/keppres-kendal-2019.pdf",
      kekId: createdKeks[1].id,
      publishedAt: new Date("2019-12-18"),
    },
  ];

  for (const doc of documentsData) {
    await prisma.document.create({ data: doc });
  }
  console.log(`📜 ${documentsData.length} dokumen regulasi JDIH berhasil dibuat.`);

  // 7. Seed Reports
  const reportsData = [
    {
      title: "Laporan Kinerja Perkembangan Kawasan Ekonomi Khusus Indonesia Tahun 2025",
      year: 2025,
      description: "Ringkasan capaian kumulatif realisasi investasi, serapan tenaga kerja, diversifikasi produk ekspor, dan keberlanjutan lingkungan di 20 KEK aktif.",
      fileUrl: "/reports/laporan-kinerja-kek-2025.pdf",
    },
    {
      title: "Laporan Tahunan Realisasi Investasi dan Ekspor KEK Indonesia Tahun 2024",
      year: 2024,
      description: "Laporan audit komprehensif neraca penanaman modal dalam negeri (PMDN) dan penanaman modal asing (PMA) pada zona industri dan pariwisata.",
      fileUrl: "/reports/laporan-tahunan-investasi-2024.pdf",
    },
  ];

  for (const rep of reportsData) {
    await prisma.report.create({ data: rep });
  }
  console.log(`📊 ${reportsData.length} laporan perkembangan tahunan berhasil dibuat.`);

  // 8. Seed Galleries
  const galleriesData = [
    {
      title: "Fasilitas Dry Port & Terminal Terpadu KEK Sei Mangkei",
      description: "Infrastruktur penunjang logistik kereta api pelabuhan untuk percepatan arus ekspor turunan sawit.",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      category: "Infrastruktur & Fasilitas",
      kekId: createdKeks[0].id,
    },
    {
      title: "Kawasan Pabrik Manufaktur Berteknologi Tinggi KEK Kendal",
      description: "Area klaster industri manufaktur ramah lingkungan dengan fasilitas zero-liquid discharge.",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      category: "Industri Manufaktur",
      kekId: createdKeks[1].id,
    },
    {
      title: "Sirkuit Internasional dan Lanskap Pesisir KEK Mandalika",
      description: "Pemandangan udara sirkuit berlatar perbukitan hijau dan pesisir laut selatan Lombok.",
      imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
      category: "Pariwisata & Olahraga",
      kekId: createdKeks[2].id,
    },
    {
      title: "Pusat Riset Teknologi & Studio Animasi KEK Nongsa",
      description: "Lingkungan kerja kreatif kolaboratif digital hub Batam bagi ratusan praktisi animasi dan IT.",
      imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      category: "Ekonomi Digital",
      kekId: createdKeks[3].id,
    },
  ];

  for (const gal of galleriesData) {
    await prisma.gallery.create({ data: gal });
  }
  console.log(`🖼️ ${galleriesData.length} data galeri berhasil dibuat.`);

  // 9. Seed Investments
  const investmentsData = [
    {
      kekId: createdKeks[0].id, // Sei Mangkei
      year: 2025,
      investmentValue: 12500000000000, // Rp 12.5 T
      employeeCount: 6800,
      description: "Ekspansi pabrik oleokimia tahap II dan pembangunan tangki timbun pelabuhan.",
    },
    {
      kekId: createdKeks[1].id, // Kendal
      year: 2025,
      investmentValue: 38200000000000, // Rp 38.2 T
      employeeCount: 31500,
      description: "Pembangunan 12 pabrik manufaktur baru di sektor otomotif listrik dan semikonduktor.",
    },
    {
      kekId: createdKeks[2].id, // Mandalika
      year: 2025,
      investmentValue: 8400000000000, // Rp 8.4 T
      employeeCount: 4200,
      description: "Pembangunan 2 resort bintang lima dan fasilitas convention center internasional.",
    },
    {
      kekId: createdKeks[3].id, // Nongsa
      year: 2025,
      investmentValue: 19800000000000, // Rp 19.8 T
      employeeCount: 5100,
      description: "Penyelesaian 2 kampus data center hyperscale berkapasitas total 60 MW.",
    },
    {
      kekId: createdKeks[4].id, // Sanur
      year: 2025,
      investmentValue: 5600000000000, // Rp 5.6 T
      employeeCount: 2300,
      description: "Instalasi peralatan diagnostik mutakhir dan penataan lanskap wellness park.",
    },
  ];

  for (const inv of investmentsData) {
    await prisma.investment.create({ data: inv });
  }
  console.log(`📈 ${investmentsData.length} data investasi development berhasil dibuat.`);

  console.log("✅ SEEDING DATA DEVELOPMENT SELESAI DENGAN SUKSES!");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
