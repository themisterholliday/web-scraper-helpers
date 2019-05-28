import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('./twitter-follower-scrapes-database.json');
const db = low(adapter);

db.defaults({ userProfiles: [{ userProfile: {} }] }).write();

export default db;
