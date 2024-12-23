import { defineStore } from 'pinia'

type UserName = 'Charlotta' | 'Zarah' | 'Vendela' | 'Axel' | 'Torsten' | 'Viktor';
type User = {
  name: UserName;
  id: string;
  color: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as UserName | null,
    users: {
      Charlotta: { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", color: '#FF6B6B' },
      Zarah: { id: "76d65cec-e84e-4ebb-8099-53d83b6c1d9d", color: '#4ECDC4' },
      Vendela: { id: "b9a9b094-7307-4b0f-b6f3-93c65f976e9f", color: '#45B7D1' },
      Axel: { id: "42bbd328-08d7-4d92-b37c-128dd7f50cbc", color: '#FFA07A' },
      Torsten: { id: "f738ab0f-e23f-4c83-844b-22727e1a4750", color: '#BD5B09' },
      Viktor: { id: "b48f2f96-279d-4cab-9257-4f00d9ea3e62", color: '#0D7AB5' }
    } as Record<UserName, Omit<User, 'name'>>
  }),
  actions: {
    setUser(userName: UserName | null) {
      this.currentUser = userName;
      if (userName) {
        localStorage.setItem('currentUser', userName);
      } else {
        localStorage.removeItem('currentUser');
      }
    },
    loadUser() {
      const savedUser = localStorage.getItem('currentUser') as UserName | null;
      if (savedUser && this.users[savedUser]) {
        this.currentUser = savedUser;
      }
    }
  },
  getters: {
    isUserSelected: (state) => state.currentUser !== null,
    currentUserColor: (state) => state.currentUser ? state.users[state.currentUser].color : null,
    currentUserInfo: (state): User | null => {
      if (state.currentUser) {
        return {
          name: state.currentUser,
          ...state.users[state.currentUser]
        };
      }
      return null;
    },
    userColors: (state) => {
      const colors: Record<UserName, string> = {} as Record<UserName, string>;
      for (const [name, user] of Object.entries(state.users)) {
        colors[name as UserName] = user.color;
      }
      return colors;
    }
  }
})
