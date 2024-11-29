export const selectAuth = state => {
  const { isLoggedIn, token } = state.auth;
  return { isLoggedIn, token };
};

export const selectIsLoggedIn = state => state.auth.isLoggedIn;

export const selectIsRefreshing = state => state.auth.isRefreshing;
  
export const selectIsRecovery = state => state.auth.isRecovery;

export const selectUser = state => state.auth.user;

export const selectToken = state => state.auth.token;

