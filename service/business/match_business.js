import { PlayerRepo } from "../repo/player_repo.js";

function calculateAge(birthDateStr) {
    if (!birthDateStr) return null;
    const dob = new Date(birthDateStr);
    if (Number.isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

export class MatchBusiness {

    static async getNewMatch(){
        console.log("in getNewMatch");
        const player = await PlayerRepo.getRandomPlayer();
        //console.log("random player fetched:", player);
        const score = await PlayerRepo.getPlayerScore(player._id);
        const profile = player.profile ?? {};
        const survey = profile.survey ?? {};

        const record = {
            playerId: player._id, // or player._id.toString()
            name: `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim(),
            age: calculateAge(profile.birthDate),
            location: profile.location ?? null, // only if you later add this to profile
            skill_level: survey.skillLevel ? Number(survey.skillLevel) : null,
            signature_move: profile.signature_move ?? null, // if you later add this
            competition_level: survey.competitiveLevel ? Number(survey.competitiveLevel) : null,
            player_rating: score.player_rating,
            matches_played: score.matches_played,
            matches_won: score.matches_won,
        };
        //console.log("random player returning:", record);
        await PlayerRepo.markAsSeen();
        return record;
    }
    static async getMatchById(playerId){
        console.log("in getMatchById with playerId:", playerId);
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


