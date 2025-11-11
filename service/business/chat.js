import {PlayerRepo} from "../repo/player.js";
import {ChatRepo} from "../repo/chat.js";

export class ChatBusiness {
    static async postChat(record){
        const existingChat = await ChatRepo.getChatByPlayers(body.playerId, body.player2_id);
        
        if (existingChat) {
            res.send(existingChat);
            return;
        } else {
            const record = await ChatBusiness.createNewChat();
            res.send(record);
            return;
        }
    }
    static async getChatHistory(){
    }
    static async getChatList(){
    }
    static async postMessage(){
    }
    static async deleteChat(){
    }
}


