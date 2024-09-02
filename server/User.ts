import { Socket } from 'socket.io';

export enum Activity {
  Online,
  Away,
  DoNotDisturb,
  Offline,
}

export class User {
  activity: Activity;

  constructor(public id: number, public socket: Socket) {
    this.id = id;
    this.socket = socket;
    this.activity = Activity.Online;
  }
}
