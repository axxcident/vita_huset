import { defineStore } from 'pinia'

type User = 'Charlotta' | 'Zarah' | 'Vendela' | 'Axel' | null;

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User,
    userColors: {
      Charlotta: '#FF6B6B',
      Zarah: '#4ECDC4',
      Vendela: '#45B7D1',
      Axel: '#FFA07A'
    }
  }),
  actions: {
    setUser(user: User) {
      this.currentUser = user;
      if (user) {
        localStorage.setItem('currentUser', user);
      } else {
        localStorage.removeItem('currentUser');
      }
    },
    loadUser() {
      const savedUser = localStorage.getItem('currentUser') as User;
      if (savedUser && Object.keys(this.userColors).includes(savedUser)) {
        this.currentUser = savedUser;
      }
    }
  },
  getters: {
    isUserSelected: (state) => state.currentUser !== null,
    currentUserColor: (state) => state.currentUser ? state.userColors[state.currentUser] : null
  }
})
