import DB from '../db/database.js';

export class MapRepo {
    static async listActive() {
        // fake_data_generator will be replaced with a db call
        console.log("MapRepo.getAllActive called");
        return fake_data_generator("map_active");
    }

    // static async getById(playerId) {
    //     // fake_data_generator will be replaced with a db call
    //     console.log(`MapRepo.getById called with userId: ${playerId}`);
    //     return fake_data_generator("map_by_id", { playerId });
    // }   

    static async upsert({playerId, lat, lng, expiresAt}) {
        console.log(`updated location for userId: ${playerId}`);
        //we will at an update to the database
    }

    static async remove(playerId) {
        console.log(`removed location for userId: ${playerId}`);
        //we will at an update to the database
    }

  }

  // utils/fake_data_generator.js
    export function fake_data_generator(data_type, opts = {}) {
        function randomItem(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function randomCoord(base, range) {
            return (base + (Math.random() - 0.5) * range).toFixed(6);
        }

        const now = Date.now();

        if (data_type === "map_active") {
            const names = ["Alex Carter", "Jamie Lee", "Taylor Morgan", "Jordan Smith", "Casey Brown"];
            return {
            userId: opts.playerId ?? `P-${randomInt(1000, 9999)}`,
            name: randomItem(names),
            lat: randomCoord(40.2338, 0.05),  // ~a few km around Provo as example
            lng: randomCoord(-111.6585, 0.05),
            expiresAt: now + 3 * 60 * 60 * 1000, // 3 hours
            };
        }

        if (data_type === "map_by_id") {
            const names = ["Alex Carter", "Jamie Lee", "Taylor Morgan", "Jordan Smith", "Casey Brown"];
            const name = randomItem(names);
            const lat = randomCoord(40.2338, 0.03);
            const lng = randomCoord(-111.6585, 0.03);

            return {
            userId: opts.playerId ?? `P-${randomInt(1000, 9999)}`,
            name,
            lat,
            lng,
            expiresAt: now + 3 * 60 * 60 * 1000,
            };
        }

        return null;
    }
