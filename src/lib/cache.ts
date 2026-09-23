// ==============================================================================
// KEK Indonesia Portal - High-Performance In-Memory Data Cache
// Drastically speeds up page rendering by avoiding redundant Neon DB network round-trips
// ==============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cacheStore = new Map<string, CacheEntry<unknown>>();

/**
 * Mengambil data dari cache in-memory jika masih valid (TTL belum kedaluwarsa).
 * Jika kedaluwarsa atau belum ada di cache, panggil fetcher dan simpan hasilnya.
 *
 * @param key Kunci unik cache (misal: "kek:stats", "news:latest")
 * @param ttlSeconds Durasi cache dalam detik (default: 30 detik)
 * @param fetcher Fungsi asinkron untuk mengambil data baru
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const existing = cacheStore.get(key);

  if (existing && now - existing.timestamp < ttlSeconds * 1000) {
    return existing.data as T;
  }

  const freshData = await fetcher();
  cacheStore.set(key, {
    data: freshData,
    timestamp: now,
  });

  return freshData;
}

/**
 * Menghapus entri cache berdasarkan prefix atau seluruh cache.
 * Dipanggil saat aksi mutasi (POST, PUT, DELETE) terjadi di API CMS Admin.
 */
export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    cacheStore.clear();
    return;
  }

  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix) || key.includes(prefix)) {
      cacheStore.delete(key);
    }
  }
}
