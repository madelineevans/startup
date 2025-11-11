import {PlayerRepo} from "../repo/player_repo.js";
import {ChatRepo} from "../repo/chat_repo.js";

export class ChatBusiness {
    static async postChat(record){
        const existingChat = await ChatRepo.fetchChatHistoryByPlayers(record.playerId, record.player2_id);
        
        if (existingChat) {
            const messages = await ChatRepo.fetchChatHistoryById(existingChat.chatId);
            const record = {
                chatId: existingChat.chatId,
                participant_ids: existingChat.participant_ids,
                messages: messages,
            };
            return record;
        } else {
            const record = await ChatRepo.createNewChat();
            return record;
        }
    }

    static async fetchChatHistoryById(chatId){
        const existingChat = await ChatRepo.getChatById(record.playerId, record.player2_id);
        const messages = await ChatRepo.fetchChatHistoryById(chatId);
        if (existingChat) {
            const record = {
                chatId: existingChat.chatId,
                participant_ids: existingChat.participant_ids,
                messages: messages,
            };
            return record;
        } else {
            throw new Error('Chat not found');
        }
    }

    static async sendMessage(chatId, message){
        const existingChat = await ChatRepo.getChatById(record.playerId, record.player2_id);
        if(existingChat){
            const message_success = await ChatRepo.sendMessage(chatId, message);
            const record = {
                chatId: existingChat.chatId,
                successful: message_success
            };
            return record;
        }
    }
}


