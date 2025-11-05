import {MatchBusiness} from './business/match.js';
import bcrypt from 'bcryptjs';
import authRepository from './repo/auth.js';
import { v4 as uuidv4 } from 'uuid';

// const bcrypt = require('bcryptjs');
// const uuid = require('uuid');
// const authRepository = require('./authRepository.js'); 

const authCookieName = 'token';

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return authRepository.getUserByToken(value);
  }
  return authRepository.getUserByEmail(value);
}

async function createAuth(req, res) {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = {
      email: req.body.email,
      password: passwordHash,
      token: uuidv4(),
    };
    await authRepository.addUser(user);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
}

async function getMatch(req, res) {
  // const user = await findUser('token', req.cookies[authCookieName]);
    const user = true;
  if (user) {
    const record = await MatchBusiness.getNewMatch();
    res.send(record);
    return;
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}
async function postChat(req, res) {
  return;
}

async function login(req, res) {
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
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    await authRepository.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
}

async function verifyAuth(req, res, next) {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

export {createAuth, login, logout, verifyAuth, getMatch, postChat};

// /*authCookieName,*/