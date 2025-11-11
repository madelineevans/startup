// const { data } = require('react-router-dom');
import DB from '../db/database.js';

export class ChatRepo {
  static async fetchChatHistoryByPlayers(playerId1, playerId2) {
    // find chatid by player ids
  }
  static async createNewChat(player1Id, player2Id){
    return null;
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
  static async sendMessage(chatId, message){
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