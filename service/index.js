import cookieParser from 'cookie-parser';
import express from 'express';
import handler from './handler.js';
import { setupPeerProxy } from './peerproxy.js';

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

setupPeerProxy(server);

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

//just get a name by id
apiRouter.post('/player/names', handler.getPlayerNames);

// auth routes
apiRouter.post('/auth/create', handler.createAuth);     //new account
apiRouter.post('/auth/login', handler.login);
apiRouter.delete('/auth/logout', handler.logout);

// Match routes
apiRouter.get('/match', handler.verifyAuth, handler.getMatch);
apiRouter.get('/match/:id', handler.verifyAuth, handler.getMatch);

// Map routes
apiRouter.post('/map/location', handler.verifyAuth, handler.postLocation);
apiRouter.delete('/map/location', handler.verifyAuth, handler.deleteLocation);
apiRouter.get('/map/players', handler.fetchAllPlayers);
//apiRouter.get('/map/player/:id', handler.verifyAuth, handler.fetchPlayerById);   //in case we don't just get one player from all players

// Chat routes
apiRouter.get('/chat/list', handler.listChats);
apiRouter.post('/chat/send', handler.sendMessage);
apiRouter.get('/chat/:chatId', handler.fetchChatHistory);
apiRouter.post('/chat', handler.postChat)

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});