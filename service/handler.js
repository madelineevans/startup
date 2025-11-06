import {MatchBusiness} from './business/match.js';
import {ChatBusiness} from './business/chat.js';
import bcrypt from 'bcryptjs';
import authRepository from './repo/auth.js';
import { v4 as uuidv4 } from 'uuid';

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
  if (!value) return null;

  if (field === 'token') {
    return authRepository.getUserByToken(value);
  }
  return authRepository.getUserByEmail(value);
}

async function createAuth(req, res) {
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
  verifyAuth(req, res, user);
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
  verifyAuth(req, res, user);
  if (user) {
    const record = await ChatBusiness.createNewChat();
    res.send(record);
    return;
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

async function login(req, res) {
    console.log("in api login");
  const user = await findUser('email', req.body.email);
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

export {createAuth, login, logout, verifyAuth, getMatch, postChat};
// /*authCookieName,*/
