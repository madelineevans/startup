// business/map.js
import { MapRepo } from '../repo/map.js'; //or other repo import
import { playerRepo } from '../repo/player.js';

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const MapBusiness = {
  async shareOrRefresh({ userId, lat, lng }) {
    const now = Date.now();
    const expiresAt = now + THREE_HOURS_MS;

    await MapRepo.upsert({
      userId,
      lat,
      lng,
      expiresAt,
    });

    return { ok: true, expiresAt };
  },

  async disable({ userId }) {
    await MapRepo.remove(userId);
  },

  async getNearby({ lat, lng, maxMeters = 5000 }) {
    const live = await MapRepo.listActive(); // [{userId, lat, lng, ts}]
    // distance filter first
    const nearby = live.filter(p => haversineMeters(lat, lng, p.lat, p.lng) <= maxMeters);

    // batch fetch names once
    const ids = nearby.map(p => p.userId);
    const profiles = await PlayerRepo.getNamesByIds(ids); 
    // Expect e.g. { [playerId]: { first_name, last_name } }

    return nearby.map(p => {
      const prof = profiles[p.userId] || {};
      const name = [prof.first_name, prof.last_name].filter(Boolean).join(' ') || 'Player';
      return { id: p.userId, name, lat: p.lat, lng: p.lng, ts: p.ts };
    });
  },

  async getById({ userId }) {
    const p = await MapRepo.get(userId);
    if (!p) return null;
    const now = Date.now();
    if (!p.enabled || now > p.expiresAt) return null;
    return { id: p.userId, lat: p.lat, lng: p.lng, ts: p.ts };
  },
};
