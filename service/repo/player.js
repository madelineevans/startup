export class PlayerInfoRepo {
  async getPlayerInfo(playerId) {
    // fake_data_generator will be replaced with a db call
    const player = fake_data_generator("player", { playerId });
    const score  = fake_data_generator("score",  { playerId: player.playerID });

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

function fake_data_generator(data_type, opts = {}) {
  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomDate(start, end) {
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d.toISOString().split("T")[0];
  }

  if (data_type === "player") {
    const names = ["Alex Carter", "Jamie Lee", "Taylor Morgan", "Jordan Smith", "Casey Brown"];
    const locations = ["New York", "London", "Sydney", "Toronto", "Tokyo"];
    const skills = ["Beginner", "Intermediate", "Advanced", "Pro"];
    const foundBy = ["Friend", "Coach", "Ad", "Event"];
    const moves = ["Spin shot", "Curve ball", "Power serve", "Precision strike"];
    const competitionLevels = ["Casual", "Amateur", "Semi-Pro", "Professional"];

    const dob = randomDate(new Date(1980, 0, 1), new Date(2010, 0, 1));
    const age = new Date().getFullYear() - new Date(dob).getFullYear();

    return {
      playerID: opts.playerId ?? `P-${Math.floor(Math.random() * 100000)}`,
      dob,
      name: randomItem(names),
      age,
      location: randomItem(locations),
      skill_level: randomItem(skills),
      time_since_starting: `${randomInt(1, 10)} years`,
      frequency_of_play: `${randomInt(1, 7)} times/week`,
      found_by: randomItem(foundBy),
      signature_move: randomItem(moves),
      competition_level: randomItem(competitionLevels),
    };
  }

  if (data_type === "score") {
    const matches_played = randomInt(10, 500);
    const matches_won = randomInt(0, matches_played); // ensure logical

    return {
      playerID: opts.playerId ?? `P-${Math.floor(Math.random() * 100000)}`,
      player_rating: randomInt(1, 10),
      matches_played,
      matches_won,
    };
  }

  return null;
}

module.exports = PlayerInfoRepo;