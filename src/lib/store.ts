// Simple state management without external dependencies
// We'll upgrade to Zustand later

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  searchHistory: string[];
}

class AppStore {
  private state: AppState = {
    user: null,
    isLoggedIn: false,
    searchHistory: [],
  };

  private listeners: Array<() => void> = [];

  getState = () => this.state;

  setState = (newState: Partial<AppState>) => {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener());
  };

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  };

  // Actions
  login = (user: User) => {
    this.setState({ user, isLoggedIn: true });
  };

  logout = () => {
    this.setState({ user: null, isLoggedIn: false });
  };

  addToSearchHistory = (searchTerm: string) => {
    const history = [...this.state.searchHistory, searchTerm].slice(-10); // Keep last 10 searches
    this.setState({ searchHistory: history });
  };
}

export const appStore = new AppStore();
export type { User, AppState };
