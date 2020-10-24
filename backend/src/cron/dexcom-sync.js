import wrapper from '../services/command-wrapper';
import command from '../commands/dexcom-sync';

wrapper(command, 30000)();