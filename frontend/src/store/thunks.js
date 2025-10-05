import { getSocket } from "@/lib/socket";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/check",
        {
          method: "GET",
          credentials: "include",
        });

      const data = await res.json()

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (userData, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {

    try {
      const res = await fetch("http://localhost:3000/api/auth/logout",
        {
          method: 'POST',
          credentials: 'include'
        }
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

export const updateprofileThunk = createAsyncThunk(
  "auth/update-profile",
  async (profilepic, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/updateprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilepic }),
      });

      const data = await res.json();


      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }

)


//messgaes thunk

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {

      const response = await fetch('http://localhost:3000/api/messages/users',
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch users');
      }

      const data = await response.json();

      return data;

    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const getMessages = createAsyncThunk(
  'users/getMessages',
  async (_, thunkAPI) => {

    const state = thunkAPI.getState();
    const selectedUser = state.chat.selectedUser;

    const userid = selectedUser.id;

    try {
      const res = await fetch(`http://localhost:3000/api/messages/${userid}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        // return rejectWithValue(errorData.message || 'Failed to fetch messages');
      }

      const data = await res.json();
      return data;
    }
    catch (error) {
      return ;
    }
  }

)

export const sendMessage = createAsyncThunk(
  'users/sendMessage',
  async (messageData, thunkAPI) => {

    const state = thunkAPI.getState();

    const selectedUser = state.chat.selectedUser;
    const authUser = state.auth.authUser;
   
    const id = selectedUser.id;

    try {
      const res = await fetch(`http://localhost:3000/api/messages/send/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        return;
      }

      const data = await res.json();

   thunkAPI.dispatch({
      type: "chat/addMessage",
      payload:data ,
    });


    const socket = getSocket();

      if (socket && socket.connected) {
        socket.emit("send-message", {
          toUserId: selectedUser.id,
          message: data,
          fromUserId: authUser.id,
        });
      }

      return data;

    }
    catch (error) {
      return;
    }

  }
)
