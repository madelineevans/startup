const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const authHandler = require('./authHandler.js');
const scoreHandler = require('./scoreHandler.js');

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// auth routes
apiRouter.post('/auth/create', authHandler.createAuth);     //new account
apiRouter.post('/auth/login', authHandler.login);
apiRouter.delete('/auth/logout', authHandler.logout);

// Match routes ---figure out implementation here


// Map routes
apiRouter.get('/map/players', mapHandler.fetchAllPlayers);
apiRouter.get('/map/player', mapHandler.fetchPlayerById);   //pass in id here? where?

// Chat routes
apiRouter.get('/chat/history', chatHandler.fetchChatHistoryById); //pass in id here? where?
apiRouter.post('/chat/send', chatHandler.sendMessage);

// Chat_list routes
apiRouter.get('/chat/list', chatHandler.listMessages);

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});