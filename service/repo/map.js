// repo/map.js
const store = new Map(); // userId -> { userId, lat, lng, expiresAt, updatedAt }

function rnd(base, range) { return Number((base + (Math.random() - 0.5) * range).toFixed(6)); }

function seedIfEmpty() {
  if (store.size > 0) return;
  const now = Date.now();
  const seed = [
    { userId: 'P-1001', name: 'Joe Mamma',   lat: rnd(40.2338, 0.03), lng: rnd(-111.6585, 0.03) },
    { userId: 'P-1002', name: 'test2',     lat: rnd(40.2338, 0.03), lng: rnd(-111.6585, 0.03) },
    { userId: 'P-1003', name: 'Mae Evans', lat: rnd(40.2338, 0.03), lng: rnd(-111.6585, 0.03) },
    { userId: 'P-1004', name: 'Chloe Sneddon',  lat: rnd(40.2338, 0.03), lng: rnd(-111.6585, 0.03) },
    { userId: 'P-1005', name: 'Pickle Player',   lat: rnd(40.2338, 0.03), lng: rnd(-111.6585, 0.03) },
  ];
  for (const p of seed) {
    store.set(p.userId, { ...p, updatedAt: now, expiresAt: now + 3 * 60 * 60 * 1000 });
  }
}

export class MapRepo {
  static async listActive() {
    seedIfEmpty();
    const now = Date.now();
    // prune expired
    for (const [id, v] of store) {
      if (!v.expiresAt || v.expiresAt <= now) store.delete(id);
    }
    return Array.from(store.values()); // array
  }

  static async get(userId) {
    return store.get(userId) || null;
  }

  static async upsert({ userId, lat, lng, expiresAt }) {
    const now = Date.now();
    const existing = store.get(userId) || {};
    store.set(userId, {
      ...existing,
      userId,
      lat: Number(lat),
      lng: Number(lng),
      name: existing.name ?? 'Player',
      updatedAt: now,
      expiresAt: Number(expiresAt) || (now + 3 * 60 * 60 * 1000),
    });
  }

  static async remove(userId) {
    store.delete(userId);
  }
}