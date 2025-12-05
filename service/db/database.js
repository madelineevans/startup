import { MongoClient, ObjectId } from 'mongodb';
import config from './dbConfig.json' with {type: 'json'};

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const conversationCollection = db.collection('conversation');
const messageCollection = db.collection('message');
const locationCollection = db.collection('location');

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

async function getNamesByIds(playerIds) {
  return await userCollection
    .find({ playerId: { $in: playerIds } }, { projection: { playerId: 1, name: 1, _id: 0 } })
    .toArray();
}

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
  console.log("fetchChatHistoryById id =", chatId);
  const chat = await conversationCollection.findOne({
    _id: ObjectId.createFromHexString(chatId)
  });
  return chat;
}

async function sendMessage(record) {
  const result = await messageCollection.insertOne(record);
  return result;
}

async function getAllChatsForPlayer(playerId) {
  const result = await conversationCollection.find({
    participants: { $regex: playerId }
  }).toArray();
  return result
}

async function getLocations(filter) {
  return await locationCollection.find(filter).toArray();
}

async function getLocationByUserId(userId) {
  return await locationCollection.findOne({ userId: userId });
}

async function updateLocation(location) {
  const filter = { userId: location.userId };
  const update = { $set: location };
  return await locationCollection.updateOne(filter, update, { upsert: true });
}

async function removeLocation(userId) {
  return await locationCollection.deleteOne({ userId: userId });
}

async function getAllPlayers() {
  return await userCollection.find({}).toArray();
}

export default {
  getUser,
  getPlayerInfo,
  getUserByToken,
  addUser,
  updateUser,
  createNewChat,
  fetchMessageHistoryById,
  fetchChatHistoryById,
  fetchChatHistoryByPlayers,
  sendMessage,
  getAllChatsForPlayer,
  getLocations,
  getLocationByUserId,
  updateLocation,
  removeLocation,
  getNamesByIds,
  getAllPlayers,
};
