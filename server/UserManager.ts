import { Activity, User } from './User';

export class UserManager {
  private users: User[] = [];

  public addUser(user: User): void {
    this.users.push(user);
  }

  public removeUserById(id: number): void {
    this.users = this.users.filter((user) => user.id !== id);
  }

  public removeUserBySocketId(socketId: string): void {
    this.users = this.users.filter((user) => user.socket.id !== socketId);
  }

  public getUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  public getUserBySocketId(socketId: string): User | undefined {
    return this.users.find((user) => user.socket.id === socketId);
  }

  public changeUserActivity(socketId: string, activity: Activity): void {
    const user = this.getUserBySocketId(socketId);
    if (user) {
      user.activity = activity;
    }
  }
}
