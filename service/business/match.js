import {PlayerRepo} from "../repo/player.js";

export class MatchBusiness {

    static async getNewMatch(){
        const player = await PlayerRepo.getPlayerInfo();
        const score = await PlayerRepo.getPlayerScore(player.playerID);
        const record = {
            playerID: player.playerID,
            dob: player.dob,
            name: player.name,
            age: player.age,
            location: player.location,
            skill_level: player.skill_level,
            signature_move: player.signature_move,
            competition_level: player.competition_level,
            player_rating: score.player_rating,
            matches_played: score.matches_played,
            matches_won: score.matches_won,
        };
        return record;
    }
}


