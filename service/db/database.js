import { MongoClient, ObjectId } from 'mongodb';
import config from './dbConfig.json' with {type: 'json'};

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const conversationCollection = db.collection('conversation');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getPlayerInfo(playerId) {
  return userCollection.findOne({ playerId: playerId });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  const result = await userCollection.insertOne(user);
  return result.insertedId;
}

async function updateUser(user) {
  const { email, ...rest } = user;
  return userCollection.updateOne({ email }, { $set: rest });
}

async function createNewChat(chatRecord) {
  const result = await conversationCollection.insertOne(chatRecord)
  return result;
}

async function fetchMessageHistoryById(chatId, num_messages, skip_count) {
  const result = await conversationCollection
    .find({ chatId: chatId })
    .skip(skip_count)
    .limit(num_messages)
    .toArray();

  return result;
}

async function fetchChatHistoryByPlayers(player1, player2) {
  const chat = await conversationCollection.findOne({
    participants: { $all: [player1, player2] }
  });
  return chat;
}

async function fetchChatHistoryById(chatId) {
  const chat = await conversationCollection.findOne({
    _id: ObjectId.createFromHexString(chatId)
  });
  return chat;
}

export default {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  createNewChat,
  fetchMessageHistoryById,
  fetchChatHistoryById,
  fetchChatHistoryByPlayers,
};
