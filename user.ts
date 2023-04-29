import { BoardGame } from './boardGame';
import * as fs from 'fs';
import * as path from 'path';
import { ReadWriteLock } from './readWriteLock';
import { GameCategory } from './gameCategory';


export interface UserData {
  id: number;
  username: string;
  password: string;
  newUser: boolean;
  boardGames: BoardGame[];
}

export class UserManager {
    private users: UserData[];
    private dataFilePath: string;
    private lock: ReadWriteLock;
  
    constructor() {
      this.dataFilePath = path.resolve(__dirname, 'users.json');
      this.lock = new ReadWriteLock();
      this.users = [];
      this.initialize();
    }
  
    private async initialize(): Promise<void> {
      this.users = await this.loadUsers();
    }
  
    private async loadUsers(): Promise<UserData[]> {
      await this.lock.acquireReadLock();
      if (fs.existsSync(this.dataFilePath)) {
        const rawData = fs.readFileSync(this.dataFilePath, 'utf-8');
        this.lock.releaseReadLock();
        return JSON.parse(rawData);
      }
      this.lock.releaseReadLock();
      return [];
    }
  
    private async saveUsers(): Promise<void> {
      await this.lock.acquireWriteLock();
      const rawData = JSON.stringify(this.users);
      fs.writeFileSync(this.dataFilePath, rawData, 'utf-8');
      this.lock.releaseWriteLock();
    }
  
    // ... (Load and save users methods here)

  async createUser(username: string, password: string): Promise<boolean> {
    if (this.users.find(user => user.username === username)) {
      return false;
    }

    const newUser: UserData = {
      id: this.users.length + 1,
      username,
      password,
      newUser: true,
      boardGames: [],
    };

    this.users.push(newUser);
    await this.saveUsers();
    return true;
  }

  async login(username: string, password: string): Promise<UserData | null> {
    const user = this.users.find(user => user.username === username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async addGameToCollection(userId: number, game: BoardGame): Promise<void> {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      user.boardGames.push(game);
      await this.saveUsers();
    }
  }

  async removeGameFromCollection(userId: number, gameId: number): Promise<void> {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      user.boardGames = user.boardGames.filter(game => game.id !== gameId);
      await this.saveUsers();
    }
  }

  async viewOtherUserCollection(username: string): Promise<BoardGame[] | null> {
    const user = this.users.find(user => user.username === username);
    if (user) {
      return user.boardGames;
    }
    return null;
  }

  async updateGameInfo(userId: number, game: BoardGame): Promise<void> {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      const gameIndex = user.boardGames.findIndex(existingGame => existingGame.id === game.id);
      if (gameIndex !== -1) {
        user.boardGames[gameIndex] = game;
        await this.saveUsers();
      }
    }
  }

  async getCategories(): Promise<GameCategory[]> {
    // Return a list of available game categories
    return Object.values(GameCategory);
  }
  
  async getUserCollection(userId: number): Promise<BoardGame[]> {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      return user.boardGames;
    }
    return [];
  }
  }