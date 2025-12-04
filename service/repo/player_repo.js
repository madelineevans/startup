// const { data } = require('react-router-dom');
import DB from '../db/database.js';

export class PlayerRepo {
  static async getPlayerInfo(playerId) {
    console.log("in getPlayerInfo with playerId:", playerId);
    // fake_data_generator will be replaced with a db call
    // note: calculate age from dob and include in return record
    return await DB.getPlayerInfo(playerId);
  }
  static async getRandomPlayer() {
    // Get a random player from the database
    console.log("in getRandomPlayer");
    const players = await DB.getAllPlayers(); // You need to implement this in your DB layer
    if (!players || players.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
  }
  static async getNamesByIds(playerIds) {
    console.log("in getNamesByIds with playerIds:", playerIds);
    // fake_data_generator will be replaced with a db call
    return await DB.getNamesByIds(playerIds);
  }
  static async getPlayerScore(playerId) {
    // fake_data_generator will be replaced with a db call
    return fake_data_generator("score", { playerId });
  }
  static async markAsSeen(playerId, seenId){
    return null;
  }
  static async getPlayerById(playerId){
    console.log("in getPlayerById with playerId:", playerId);
    // fake_data_generator will be replaced with a db call
    return await DB.getPlayerInfo(playerId);
  }
}

function fake_data_generator(data_type, opts = {}) {
  const seed = {
    'P-1001': { name: 'Joe Mamma' },
    'P-1002': { name: 'test2' },
    'P-1003': { name: 'Mae Evans' },
    'P-1004': { name: 'Chloe Sneddon' },
    'P-1005': { name: 'Pickle Player' },
  };

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
      name: seed[opts.playerId]?.name ?? randomItem(names),
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

    // return array of { playerId, name } for given IDs
    const n = [];

    if (Array.isArray(opts.playerIds) && opts.playerIds.length > 0) {
      for (const playerId of opts.playerIds) {
        const seededName = seed[playerId]?.name;
        const name = seededName ?? randomItem(names); // use seeded or random
        n.push({ playerId, name });
      }
      return n;
    }

    // if no playerIds provided, return all seeded + some random extras
    return {
      playerId: opts.playerId ?? `P-${Math.floor(Math.random() * 100000)}`,
      name: seededPlayer ? seededPlayer.name : randomItem(names),
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