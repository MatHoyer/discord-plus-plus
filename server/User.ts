import { Socket } from 'socket.io';

export type TActivity = 'Online' | 'Away' | 'DoNotDisturb' | 'Offline';

export const Activity: Record<TActivity, string> = {
  Online: 'Online',
  Away: 'Away',
  DoNotDisturb: 'Do not disturb',
  Offline: 'Offline',
};

export class User {
  activity: TActivity;

  constructor(public id: number, public socket: Socket) {
    this.id = id;
    this.socket = socket;
    this.activity = 'Online';
  }
}
