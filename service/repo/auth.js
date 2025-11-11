//all the interactions with the database will be here

const DB = require('../db/database.js');

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

module.exports = new AuthRepository();