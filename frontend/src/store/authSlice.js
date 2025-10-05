import { createSlice } from '@reduxjs/toolkit';
import { checkAuth, loginThink, loginThunk, logoutThunk, signupThunk, updateprofileThunk } from './thunks';

const initialState = {
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  onlineUsers: [],
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => { state.authUser = action.payload; },
    setSigningUp: (state, action) => { state.isSigningUp = action.payload; },
    setLoggingIn: (state, action) => { state.isLoggingIn = action.payload; },
    setUpdatingProfile: (state, action) => { state.isUpdatingProfile = action.payload; },
    setCheckingAuth: (state, action) => { state.isCheckingAuth = action.payload; },
    setonlineUsers: (state, action) => { state.onlineUsers = action.payload },
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {

    builder
      .addCase(signupThunk.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.authUser = action.payload;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.isSigningUp = false;

      });

    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload.user;

      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoggingIn = false;

      });

    builder
      .addCase(updateprofileThunk.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateprofileThunk.fulfilled, (state) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
      })
      .addCase(updateprofileThunk.rejected, (state) => {
        state.isUpdatingProfile = false;
      })



    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.authUser = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.isLoggingOut = false;
      });

    builder
      .addCase(checkAuth.pending, (state) => { state.isCheckingAuth = true; })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => { state.isCheckingAuth = false; });
  },
});

export const {
  setAuthUser,
  setSigningUp,
  setLoggingIn,
  setUpdatingProfile,
  setCheckingAuth,
  resetAuthState,
  setonlineUsers,
} = authSlice.actions;

export default authSlice.reducer;
