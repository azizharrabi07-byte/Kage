// Simple token store so apiClient can access the current token without hooks
let currentToken: string | null = null;

export const authTokenStore = {
  setToken(token: string | null) {
    currentToken = token;
  },
  getToken(): string | null {
    return currentToken;
  },
  clear() {
    currentToken = null;
  },
};