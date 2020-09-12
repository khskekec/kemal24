import createLogger from 'concurrency-logger';
import { createWriteStream } from 'fs';

export default () => createLogger({
    timestamp: true
});