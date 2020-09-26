import wrapper from '../services/command-wrapper';
import command from '../commands/freestyle-libre-sync';

wrapper(command, 30000)();