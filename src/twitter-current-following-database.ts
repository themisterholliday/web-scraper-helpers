import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('./twitter-current-following-database.json');
const db = low(adapter);

db.defaults({ followers: [] }).write();

export default db;
