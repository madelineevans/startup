import {PlayerRepo} from "../repo/player_repo.js";
import {ChatRepo} from "../repo/chat_repo.js";


export class ChatBusiness {
    static async postChat(chat_record){
        const existingChat = await ChatRepo.fetchChatHistoryByPlayers(chat_record.player_id, chat_record.player2_id);
        
        if (existingChat) {
            const messages = await ChatRepo.fetchMessageHistoryById(chatId);
            const record = {
                chatId: existingChat.chatId,
                participant_ids: existingChat.participant_ids,
                messages: messages,
            };
            return record;
        } else {
            const return_val = await ChatRepo.createNewChat(chat_record.player_id, chat_record.player2_id);
            const record = {
                chatId: return_val,
                // participant_ids: existingChat.participant_ids,
                // messages: {},
            }
            return record;
        }
    }

    static async fetchChatHistoryById(chatId){
        const existingChat = await ChatRepo.getChatById(chatId);
        const messages = await ChatRepo.fetchMessageHistoryById(chatId);
        if (existingChat) {
            const record = {
                chatId: existingChat._id,
                participants: existingChat.participants,
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


