// repo/map.js
// Placeholder repo; swap to real DB later.

const store = new Map(); // userId -> { userId, lat, lng, expiresAt, updatedAt }

// --- Fake data generator (local to this file) ---
function fake_data_generator(data_type, opts = {}) {
  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // return a NUMBER, not string
  function randomCoord(base, range) {
    return Number((base + (Math.random() - 0.5) * range).toFixed(6));
  }

  const now = Date.now();

  if (data_type === "map_active") {
    const names = ["Alex Carter", "Jamie Lee", "Taylor Morgan", "Jordan Smith", "Casey Brown"];
    return {
      userId: opts.userId ?? `P-${randomInt(1000, 9999)}`,
      name: randomItem(names),
      lat: randomCoord(40.2338, 0.05),
      lng: randomCoord(-111.6585, 0.05),
      expiresAt: now + 3 * 60 * 60 * 1000, // 3 hours
    };
  }

  if (data_type === "map_by_id") {
    const names = ["Alex Carter", "Jamie Lee", "Taylor Morgan", "Jordan Smith", "Casey Brown"];
    return {
      userId: opts.userId ?? `P-${randomInt(1000, 9999)}`,
      name: randomItem(names),
      lat: randomCoord(40.2338, 0.03),
      lng: randomCoord(-111.6585, 0.03),
      expiresAt: now + 3 * 60 * 60 * 1000,
    };
  }

  return null;
}

export class MapRepo {
  // Return an ARRAY
  static async listActive() {
    console.log("MapRepo.listActive called");

    // If nothing in memory yet, seed a few fake players for testing
    if (store.size === 0) {
      for (let i = 0; i < 5; i++) {
        const p = fake_data_generator("map_active");
        store.set(p.userId, p);
      }
    }

    // Sweep out any expired rows (just for realism in tests)
    const now = Date.now();
    for (const [id, v] of store) {
      if (!v.expiresAt || v.expiresAt <= now) store.delete(id);
    }

    return Array.from(store.values()); // <-- array!
  }

  static async get(userId) {
    return store.get(userId) || null;
  }

  // Keep param names consistent with business layer: userId
  static async upsert({ userId, lat, lng, expiresAt }) {
    const now = Date.now();
    const existing = store.get(userId) || {};
    const updated = {
      ...existing,
      userId,
      lat: Number(lat),
      lng: Number(lng),
      expiresAt: Number(expiresAt),
    };
    store.set(userId, updated);
    console.log(`MapRepo.upsert -> updated location for userId: ${userId}`);
  }

  static async remove(userId) {
    console.log("MapRepo.remove called for userId:", userId);
  }
}
