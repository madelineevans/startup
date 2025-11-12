// const { data } = require('react-router-dom');
import DB from '../db/database.js';

export class ChatRepo {
  static async fetchChatHistoryByPlayers(playerId1, playerId2) {
    const chat_data = await DB.fetchChatHistoryByPlayers(playerId1, playerId2);
    return chat_data;
  }

  static async fetchMessageHistoryById(chatId, num_messages = 20, page_num = 1){
    const skip_count = num_messages * (page_num-1);
    const messages = await DB.fetchMessageHistoryById(chatId, num_messages, skip_count);
    return messages;
  }
  // do first
  static async createNewChat(player1Id, player2Id){
    const participants = Array();
    participants.push(player1Id);
    participants.push(player2Id);

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
    const chat_data = await DB.fetchChatHistoryById(chatId);
    return chat_data;
  }

  static async getChatById(chatId){
    const chat_data = await DB.fetchChatHistoryById(chatId);
    return chat_data;
  }

  static async sendMessage(chatId, playerId, message){
    const record = {
      chatId: chatId,
      created_at: new Date(),
      text: message,
      player_id: playerId
    }
    const result = await DB.sendMessage(record);
    if (result.acknowledged){
      return true;
    } else {
        return false;
    }
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