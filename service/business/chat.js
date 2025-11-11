import {PlayerRepo} from "../repo/player.js";
import {ChatRepo} from "../repo/chat.js";

export class ChatBusiness {

    static async createNewChat(){
        // does chat already exist between the players?
        const chat = await ChatRepo.getChatByPlayers();
        // if so, return the chat
        // if not, create a new chat
        const player = await PlayerRepo.getPlayerInfo();
    }
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


