import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not set. Add it to server/.env');
}

const client = new MongoClient(uri);
await client.connect();
const database = client.db(process.env.MONGODB_DB_NAME || 'digital_menu');

export const collections = {
  admins: database.collection('admins'),
  restaurants: database.collection('restaurants'),
  categories: database.collection('categories'),
  items: database.collection('items'),
  orders: database.collection('orders'),
  // Uploaded images live here as binary data — no third-party image host
  // needed, and it sidesteps the geo-restrictions some of those hit.
  uploads: database.collection('uploads'),
};

// Strips Mongo's internal _id from a document before sending it to the client
// (the app uses its own nanoid-based `id` field throughout).
export function clean(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest;
}
export function cleanAll(docs) {
  return docs.map(clean);
}
