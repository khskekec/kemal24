import dotEnv from '../services/dotenv';
import database from '../middelwares/database';

database.database().sync({ alter: true });