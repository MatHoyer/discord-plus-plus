import { Server, Socket } from 'socket.io';

export type TActivity = 'Online' | 'Away' | 'DoNotDisturb' | 'Offline';

export const Activity: Record<TActivity, string> = {
  Online: 'Online',
  Away: 'Away',
  DoNotDisturb: 'Do not disturb',
  Offline: 'Offline',
};

export class User {
  activity: TActivity;
  activityMemory: TActivity;

  constructor(public id: number, public socket: Socket, public io: Server) {
    this.id = id;
    this.socket = socket;
    this.io = io;
    this.activity = 'Online';
    this.activityMemory = 'Online';
  }
}
