import {playerInfoRepo} from "../repo/player.js";

const playerRepo = new PlayerInfoRepo();

export async function getNewMatch(){
    playerRepo.getPlayerInfo();
}


