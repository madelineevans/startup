//all the interactions with the database will be here

import DB from '../db/database.js';

class AuthRepository {
  async getUserByEmail(email) {
    return DB.getUser(email);
  }

  async getUserByToken(token) {
    return DB.getUserByToken(token);
  }

  async addUser(user) {
    return DB.addUser(user);
  }

  async updateUser(user) {
    return DB.updateUser(user);
  }
}

export default new AuthRepository();