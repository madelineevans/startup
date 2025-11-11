import {PlayerRepo} from "../repo/player.js";
import {ChatRepo} from "../repo/chat.js";

export class ChatBusiness {
    static async postChat(record){
        const existingChat = await ChatRepo.getChatByPlayers(record.playerId, record.player2_id);
        
        if (existingChat) {
            const messages = await ChatRepo.fetchChatHistoryById(existingChat.chatId);
            const record = {
                chatId: existingChat.chatId,
                participant_ids: existingChat.participant_ids,
                messages: messages,
            };
            return record;
        } else {
            const record = await ChatBusiness.createNewChat();
            return record;
        }
    }

    static async fetchChatHistoryById(chatId){
        const existingChat = await ChatRepo.getChatById(record.playerId, record.player2_id);
        const messages = fetchChatHistoryById(chatId);
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

    static send
}


