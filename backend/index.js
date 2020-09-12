import './src/services/dotenv';
import server from './src/server.js';

server.listen(process.env.PORT);
