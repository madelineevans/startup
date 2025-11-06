// const { data } = require('react-router-dom');
// const DB = require('../database.js');

export class ChatRepo {
  static async getChatByPlayers(playerId) {
    
  }
  static async getPlayerScore(playerId) {
    // fake_data_generator will be replaced with a db call
    return fake_data_generator("score", { playerId });
  }
}