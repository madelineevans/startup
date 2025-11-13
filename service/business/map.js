// business/map.js
import { MapRepo } from '../repo/map.js';
import { PlayerRepo } from '../repo/player_repo.js';

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const MapBusiness = {
  async shareOrRefresh({ userId, lat, lng, expiresAt }) {
    console.log("in MapBusiness.shareOrRefresh for userId:", userId);
    const user = {
      userId,
      lat,
      lng,
      expiresAt,
    }
    await MapRepo.update(user);
    return { ok: true, expiresAt };
  },

  async disable({ userId }) {
    console.log("in MapBusiness.disable for userId:", userId);
    await MapRepo.remove(userId);
  },

  async getAll() {
    console.log("in MapBusiness.getAll");
    const live = await MapRepo.listActive(); // [{ userId, lat, lng, expiresAt }]
    const now = Date.now();
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

    // Filter out any players whose expiry is more than 3h in the future or already expired
    const active = live.filter(p => p.expiresAt && p.expiresAt - now <= THREE_HOURS_MS && p.expiresAt > now);

    // batch fetch names once
    const ids = active.map(p => p.userId);
    const profiles = await PlayerRepo.getNamesByIds(ids);
    const profileById = new Map(profiles.map(pr => [pr.playerId, pr])); 
    // Expect e.g. { [playerId]: { first_name, last_name } }

    return active.map(p => {
      const prof = profileById.get(p.userId);
      const name = prof?.name || [prof?.first_name, prof?.last_name].filter(Boolean).join(' ') || 'Player';

      console.log("name for userId", p.userId, "is", name);

      return { id: p.userId, name, lat: p.lat, lng: p.lng, expiresAt: p.expiresAt};
    });
  },

  async getNearby({ lat, lng, maxMeters = 20000 }) { //in case we want to adjust
    console.log("in MapBusiness.getNearby");
    const live = await MapRepo.listActive(); // [{userId, lat, lng, expiresAt}]
    // distance filter first
    const nearby = live; //add this back when db --> .filter(p => haversineMeters(lat, lng, p.lat, p.lng) <= maxMeters);

    // batch fetch names once
    const ids = nearby.map(p => p.userId);
    const profiles = await PlayerRepo.getNamesByIds(ids); 
    // Expect e.g. { [playerId]: { first_name, last_name } }

    return nearby.map(p => {
      const prof = profiles[p.userId] || {};
      const name = [prof.first_name, prof.last_name].filter(Boolean).join(' ') || 'Player';
      console.log("name for userId", p.userId, "is", name);
      return { id: p.userId, name: name, lat: p.lat, lng: p.lng, expiresAt: p.expiresAt };
    });
  },

//   async getById({ userId }) {    //should just be a local search thing because already have all data on the map
//     const p = await MapRepo.get(userId);
//     if (!p) return null;
//     const now = Date.now();
//     if (!p.enabled || now > p.expiresAt) return null;
//     return { id: p.userId, lat: p.lat, lng: p.lng, ts: p.ts };
//   },
};
