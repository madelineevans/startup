// const { data } = require('react-router-dom');
import DB from '../db/database.js';

export class ChatRepo {
  static async fetchChatHistoryByPlayers(playerId1, playerId2) {
    // find chatid by player ids
  }
  // do first
  static async createNewChat(player1Id, player2Id){
    const participants = player1Id + "," + player2Id;
    const record = {
      participants: participants,
      blocked: false,
      created_at: new Date(),
      updated_at: new Date(),
    }
    const result = await DB.createNewChat(record);
    return result.insertedId;
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