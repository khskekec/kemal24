import './src/services/dotenv';
import server from './src/server.js';

server.listen(process.env.PORT, () => console.info(`Server running on port: ${process.env.PORT}`));
