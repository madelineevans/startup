import {MatchBusiness} from './business/match_business.js';
import {ChatBusiness} from './business/chat_business.js';
import bcrypt from 'bcryptjs';
import authRepository from './repo/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { PlayerRepo } from './repo/player_repo.js';
import { ChatRepo } from './repo/chat_repo.js';
import { MapBusiness } from './business/map.js';

const authCookieName = 'token';
// done
function setAuthCookie(res, authToken) {
    console.log("in setAuthCookie");
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// TODO: change this to set playerId in the session not in a cookie
function setPlayerIdCookie(res, playerId) {
    console.log("in setAuthCookie");
  res.cookie('playerId', playerId, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// done
async function findUser(field, value) {
    // console.log("in findUser");
    // console.log("field:", field);
    // console.log("value:", value);
  if (!value) {
    return null;
  }

  if (field === 'token') {
    //console.log("looking up by token");
    return authRepository.getUserByToken(value);
  }
  return authRepository.getUserByEmail(value);
}

// separate tables in db (auth, player, stats)
async function createAuth(req, res) {
    console.log("in createAuth");
  const { email, password, profile } = req.body || {};
  if (!email || !password) return res.status(400).send({ msg: 'Email and password are required' });
  if (await findUser('email', email)) return res.status(409).send({ msg: 'Existing user' });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email,
    password: passwordHash,
    token: uuidv4(),
    profile: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      birthDate: profile?.birthDate ?? '',
      survey: {
        skillLevel: profile?.survey?.skillLevel ?? '',
        timePlayed: profile?.survey?.timePlayed ?? '',
        playFrequency: profile?.survey?.playFrequency ?? '',
        competitiveLevel: profile?.survey?.competitiveLevel ?? '',
        foundSite: profile?.survey?.foundSite ?? '',
      },
    },
    createdAt: new Date(),
  };

  const generated_id = await authRepository.addUser(user);
  setAuthCookie(res, user.token);
  setPlayerIdCookie(res, generated_id);
  res.send({ email: user.email, playerId: generated_id});
}

// todo: connect to db
async function getMatch(req, res) {
  console.log("in getMatch");
  const user = await findUser('token', req.cookies[authCookieName]);
  console.log("user:", user);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  try {
    const playerId = req.params.id || req.query.id; // allow both, but prefer /match/:id
    let record;
    if (playerId) {
      record = await MatchBusiness.getMatchById(playerId);
    } else {
      record = await MatchBusiness.getNewMatch();
    }
    //console.log("fetched match record:", record);
    if (!record) {
      return res.status(404).send({ msg: 'Match not found' });
    }
    res.send(record);
  } catch (e) {
    console.error("error in getMatch:", e);
    res.status(500).send({ msg: 'Server error' });
  }
}
// done
async function postChat(req, res) {
  console.log("in postChat");
  const user = await findUser('token', req.cookies[authCookieName]);
  const body = req.body || {};

  if (user) {
    const record = await ChatBusiness.postChat(body);
    res.send(record);
    return;
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}
// done
async function fetchChatHistory(req, res) {
  console.log("in handler fetchChatHistory");
  const user = await findUser('token', req.cookies[authCookieName]);
  const chat_id = req.params.chatId;

  if (user) {
    console.log("request: ", req.params);
    console.log("chat_id:", chat_id);
    const record = await ChatBusiness.fetchChatHistoryById(chat_id);
    res.send(record);
    return;
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}
// done
async function sendMessage(req, res) {
  console.log("in sendMessage");
  const user = await findUser('token', req.cookies[authCookieName]);
  const body = req.body || {};

  if (user) {
    const record = await ChatBusiness.sendMessage(body.chat_id, body.player_id, body.message);
    res.send(record);
    return;
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

//TODO: finish endpoint
async function listChats(req, res) {
  console.log("in listChats");
  const user = await findUser('token', req.cookies[authCookieName]);

  if (user) {
    //console.log("user: ", user, "user id:", String(user._id));
    const record = await ChatBusiness.listMessages(String(user._id));
    console.log("listChats record:", record);
    res.send(record);
    return;
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

async function postLocation(req, res) {
  console.log("in postLocation");
  console.log("req.body:", req.body);
  try{
    const { lat, lng } = req.body || {};
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).send({ msg: 'Latitude and longitude must be numbers' });
    }
    const result = await MapBusiness.shareOrRefresh({
      userId: req.user.token,
      lat,
      lng,
      expiresAt: Date.now() + 3 * 60 * 60 * 1000,
  });
  
  return res.json(result); // { ok: true, expiresAt }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Internal error' });
  }
}

async function deleteLocation(req, res) {
  console.log("in deleteLocation");
  try {
    await MapBusiness.disable({ userId: req.user.token });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Internal error' });
  }
}
// todo: test
async function fetchAllPlayers(req, res) {
  console.log("in fetchAllPlayers");
  try {
    const players = await MapBusiness.getAll();
    // returns [{ id, name, lat, lng, expiresAt }]
    return res.json({ players });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Internal error' });
  }
}
// todo: test
async function fetchPlayerById(req, res) {
  console.log("in fetchPlayerById");
  try {
    const id = req.params.id || req.query.id; // allow both, but prefer /map/player/:id
    if (!id) return res.status(400).json({ msg: 'id required' });

    const player = await MapBusiness.getById({ userId: id });
    if (!player) return res.status(404).json({ msg: 'not found' });
    return res.json(player);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Internal error' });
  }
}
// done
async function login(req, res) {
  console.log("in api login");
  const user = await findUser('email', req.body.email);
  console.log("user:", user);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuidv4();
      await authRepository.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
}
// done
async function logout(req, res) {
    console.log("in api logout");
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    await authRepository.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
}
// done
async function verifyAuth(req, res, next) {
    //console.log("in verifyAuth");
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user; // <-- Attach user to req delete if change mind
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

async function getPlayerNames(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).send({ msg: 'Invalid ids' });
  const names = await PlayerRepo.getNamesByIds(ids);
  res.send(names);
}

export default {createAuth, login, logout, verifyAuth, getMatch, postChat, 
  postLocation, fetchAllPlayers, fetchPlayerById, deleteLocation, 
  fetchChatHistory, sendMessage, listChats, getPlayerNames};
// /*authCookieName, listChats*/
