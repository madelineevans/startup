// const { data } = require('react-router-dom');
// const DB = require('../database.js');

export class ChatRepo {
  static async getChatByPlayers(playerId1, playerId2) {
      // find chatid by player ids
  }
  static async getPlayerScore(playerId) {
    // fake_data_generator will be replaced with a db call
    return fake_data_generator("score", { playerId });
  }
  static async fetchChatHistoryById(chatId){
    return null;
  }
  static async getChatById(chatId){
    return null;
  }
}
/**
CONVERSATION:
    chatId: int
    participants: string-player ids concatenated
    blocked: boolean
    created_at: luxon date-time object
    updated_at: luxon date-time object
*/