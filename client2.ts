import * as net from 'net';
import * as readline from 'readline';
import { UserManager } from './user';
import { GameCategory } from './gameCategory';

export function handleClient(socket: net.Socket) {
  const userManager = new UserManager();
  const rl = readline.createInterface({ input: socket, output: socket });

  socket.write('Welcome to BoardGame Collectors\n');

  rl.on('line', async (line) => {
    const [command, ...args] = line.trim().split(' ');

    // Implement the required functionality
    switch (command) {
      case 'createUser':
        // createUser(username, password)
        break;
      case 'login':
        // login(username, password)
        break;
      case 'viewCollection':
        // viewCollection(userId)
        break;
      case 'addGame':
        // addGame(userId, gameData)
        break;
      case 'removeGame':
        // removeGame(userId, gameId)
        break;
      case 'viewOtherUserCollection':
        // viewOtherUserCollection(userId, otherUsername)
        break;
      case 'updateGameInfo':
        // updateGameInfo(userId, gameId, gameData)
        break;
      case 'close':
        socket.end();
        break;
      default:
        socket.write('Unknown command\n');
    }
  });
}
