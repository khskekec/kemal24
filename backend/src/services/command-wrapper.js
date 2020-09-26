const { promisify } = require('util');

const sleep = promisify(setTimeout);

export default (command, sleepMillis) => async () => {
    let runCounter = 1;
    while (true) {
        console.log('Starting command ('+ runCounter++ +' run(s)...');
        await command();
        console.log('Command finished - Waiting for ' + sleepMillis + ' milliseconds...');
        await sleep(sleepMillis);
    }
}
