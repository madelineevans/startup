// business/map.js
import { MapRepo } from '../repo/map.js'; //or other repo import

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const MapBusiness = {
  async shareOrRefresh({ userId, name, lat, lng }) {
    const now = Date.now();
    const expiresAt = now + THREE_HOURS_MS;

    await MapRepo.upsert({
      userId,
      name,
      lat,
      lng,
      enabled: true,
      ts: now,
      expiresAt,
    });

    return { ok: true, expiresAt };
  },

  async disable({ userId }) {
    await MapRepo.remove(userId);
  },

  async getNearby({ lat, lng, maxMeters = 5000 }) {
    // Repo returns only currently “live” users (enabled and not expired)
    const all = await MapRepo.listActive();
    const out = [];
    for (const p of all) {
      const d = haversineMeters(lat, lng, p.lat, p.lng);
      if (d <= maxMeters) {
        out.push({ id: p.userId, name: p.name, lat: p.lat, lng: p.lng, ts: p.ts });
      }
    }
    return out;
  },

  async getById({ userId }) {
    const p = await MapRepo.get(userId);
    if (!p) return null;
    const now = Date.now();
    if (!p.enabled || now > p.expiresAt) return null;
    return { id: p.userId, name: p.name, lat: p.lat, lng: p.lng, ts: p.ts };
  },
};
