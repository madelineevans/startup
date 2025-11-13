// repo/map.js
const store = new Map(); // userId -> { userId, lat, lng, expiresAt, updatedAt }
import DB from '../db/database.js';

export class MapRepo {
  static async listActive() {  
    const now = Date.now();
    const locations = await DB.getLocations({ expiresAt: { $gt: now } });
    return locations;
  }

  static async get(userId) {
    return DB.getLocationByUserId(userId);
  }

  static async update(user) {
    const now = Date.now();
    const location = {
      _id: user.userId,
      lat: Number(user.lat),
      lng: Number(user.lng),
      expiresAt: Number(user.expiresAt) || (now + 3 * 60 * 60 * 1000),
    };
    return await DB.updateLocation(location);
  }

  static async remove(userId) {
    return await DB.removeLocation(userId);
  }
}