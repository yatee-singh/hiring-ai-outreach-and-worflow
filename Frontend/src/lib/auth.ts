export interface Organization {
    id: string;
    name: string;
  }
  
  export interface User {
    id: string;
    username: string;
    name: string;
    role: string;
    organization: Organization;
  }
  
  const USER_KEY = "user";
  
  export const auth = {
    getUser(): User | null {
      const user = localStorage.getItem(USER_KEY);
  
      if (!user) return null;
  
      return JSON.parse(user);
    },
  
    login(user: User) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );
  
      window.dispatchEvent(
        new Event("auth-change")
      );
    },
  
    logout() {
      localStorage.removeItem(USER_KEY);
  
      window.dispatchEvent(
        new Event("auth-change")
      );
    },
  
    isAuthenticated() {
      return !!localStorage.getItem(USER_KEY);
    },
  };