import {PlayerRepo} from "../repo/player_repo.js";

export class MatchBusiness {

    static async getNewMatch(){
        const player = await PlayerRepo.getPlayerInfo();
        const score = await PlayerRepo.getPlayerScore(player.playerID);
        const record = {
            playerId: player.playerId,
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
        await PlayerRepo.markAsSeen();
        return record;
    }
    static async getMatchById(playerId){
        const player = await PlayerRepo.getPlayerById(playerId);
        if (!player) {
            return null;
        }
        const score = await PlayerRepo.getPlayerScore(player.playerID);
        const record = {
            playerId: player.playerId,
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
        await PlayerRepo.markAsSeen();
        return record;
    }
}


