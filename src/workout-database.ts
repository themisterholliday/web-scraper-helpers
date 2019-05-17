import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('./workout-database.json');
const db = low(adapter);

db.defaults({ workouts: [] }).write();

export default db;
