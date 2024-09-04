import { create } from 'zustand';
import { TActivity } from '../../server/User';

type TActivtyStore = {
  users: Record<number, TActivity>;
  changeActivity: (userId: number, activity: TActivity) => void;
};

export const useActivity = create<TActivtyStore>((set) => ({
  users: {},

  changeActivity: (userId: number, activity: TActivity) =>
    set((state) => ({
      users: {
        ...state.users,
        [userId]: activity,
      },
    })),
}));
