import {MatchBusiness} from './business/match.js';
import {ChatBusiness} from './business/chat.js';
import bcrypt from 'bcryptjs';
import authRepository from './repo/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { PlayerRepo } from './repo/player.js';
import { ChatRepo } from './repo/chat.js';
import { MapBusiness } from './business/map.js';

const authCookieName = 'token';

function setAuthCookie(res, authToken) {
    console.log("in setAuthCookie");
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

async function findUser(field, value) {
    console.log("in findUser");
    console.log("field:", field);
    console.log("value:", value);
  if (!value) {
    return null;
  }

  if (field === 'token') {
    console.log("looking up by token");
    return authRepository.getUserByToken(value);
  }
  return authRepository.getUserByEmail(value);
}

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

  await authRepository.addUser(user);
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
}

async function getMatch(req, res) {
  console.log("in getMatch");
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    const record = await MatchBusiness.getNewMatch();
    res.send(record);
    return;
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

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

async function postLocation(req, res) {
  console.log("in postLocation");
  try{
    const { lat, lng } = req.body || {};
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).send({ msg: 'Latitude and longitude must be numbers' });
    }

    const result = await MapBusiness.shareOrRefresh({
      userId: req.user.id,
      lat,
      lng,
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
    await MapBusiness.disable({ userId: req.user.id });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Internal error' });
  }
}

async function fetchAllPlayers(req, res) {
  console.log("in fetchAllPlayers");
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ msg: 'lat and lng query params are required' });
    }

    const players = await MapBusiness.getNearby({ lat, lng });
    // returns [{ id, name, lat, lng, ts }]
    return res.json({ players });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Internal error' });
  }
}

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

async function verifyAuth(req, res, next) {
    console.log("in verifyAuth");
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

export {createAuth, login, logout, verifyAuth, getMatch, postChat, postLocation, fetchAllPlayers, fetchPlayerById, deleteLocation};
// /*authCookieName,*/
