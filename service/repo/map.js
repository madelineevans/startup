export class MapRepo {
    static async getAllActive() {
        // fake_data_generator will be replaced with a db call
        console.log("MapRepo.getAllActive called");
        return fake_data_generator("map_active");
    }

    static async getById(playerId) {
        // fake_data_generator will be replaced with a db call
        console.log(`MapRepo.getById called with userId: ${playerId}`);
        return fake_data_generator("map_by_id", { playerId });
    }   

    static async upsert({playerId, lat, lng, expiresAt}) {
        console.log(`updated location for userId: ${playerId}`);
        //we will at an update to the database
    }

    static async remove(playerId) {
        console.log(`removed location for userId: ${playerId}`);
        //we will at an update to the database
    }

  }