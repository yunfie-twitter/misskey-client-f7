import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    instances: [],
    currentInstance: null,
    user: null,
    token: null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentInstanceUrl: (state) => state.currentInstance?.url || null,
  },
  
  actions: {
    initAuth() {
      const savedInstances = localStorage.getItem('misskey_instances');
      const savedCurrent = localStorage.getItem('misskey_current_instance');
      const savedToken = localStorage.getItem('misskey_token');
      const savedUser = localStorage.getItem('misskey_user');
      
      if (savedInstances) {
        this.instances = JSON.parse(savedInstances);
      }
      if (savedCurrent) {
        this.currentInstance = JSON.parse(savedCurrent);
      }
      if (savedToken) {
        this.token = savedToken;
      }
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    },
    
    addInstance(instance) {
      if (!this.instances.find(i => i.url === instance.url)) {
        this.instances.push(instance);
        localStorage.setItem('misskey_instances', JSON.stringify(this.instances));
      }
    },
    
    setCurrentInstance(instance) {
      this.currentInstance = instance;
      localStorage.setItem('misskey_current_instance', JSON.stringify(instance));
    },
    
    setAuth(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem('misskey_token', token);
      localStorage.setItem('misskey_user', JSON.stringify(user));
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('misskey_token');
      localStorage.removeItem('misskey_user');
    },
    
    switchInstance(instance) {
      this.logout();
      this.setCurrentInstance(instance);
    }
  }
});
