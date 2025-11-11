// const { data } = require('react-router-dom');
import DB from '../db/database.js';

export class PlayerRepo {
  static async getPlayerInfo(playerId) {
    // fake_data_generator will be replaced with a db call
    // note: calculate age from dob and include in return record
    return fake_data_generator("player", { playerId });
  }
  static async getNamesByIds(playerIds) {
    // fake_data_generator will be replaced with a db call
    return fake_data_generator("names", { playerIds });  
  }
  static async getPlayerScore(playerId) {
    // fake_data_generator will be replaced with a db call
    return fake_data_generator("score", { playerId });
  }
  static async markAsSeen(playerId, seenId){
    return null;
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
    const locations = ["New York", "London", "Sydney", "Toronto", "Tokyo", "Provo", "Orem"];
    const skills = ["Never Played","Beginner", "Intermediate", "Advanced", "Pro"];
    const foundBy = ["Friend", "Coach", "Ad", "Event"];
    const moves = ["Spin shot", "Curve ball", "Power serve", "Precision strike"];
    const competitionLevels = ["I just need someone to learn with", "I just want to have fun", "I want it to be a little competitive", "I want it to be competitive", "Do or die"];

    const dob = randomDate(new Date(1980, 0, 1), new Date(2010, 0, 1));
    const age = new Date().getFullYear() - new Date(dob).getFullYear();

    return {
      playerId: opts.playerId ?? `P-${Math.floor(Math.random() * 100000)}`,
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

  if (data_type === "names") {
    const names = ["Alex Carter", "Jamie Lee", "Taylor Morgan", "Jordan Smith", "Casey Brown"];
    return {
      playerId: opts.playerId ?? `P-${Math.floor(Math.random() * 100000)}`,
      name: randomItem(names),
    };
  }

  if (data_type === "score") {
    const matches_played = randomInt(10, 500);
    const matches_won = randomInt(0, matches_played); // ensure logical

    return {
      playerId: opts.playerId ?? `P-${Math.floor(Math.random() * 100000)}`,
      player_rating: randomInt(1, 10),
      matches_played,
      matches_won,
    };
  }

  return null;
}