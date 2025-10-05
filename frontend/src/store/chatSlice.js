import { fetchUsers, getMessages, sendMessage } from "./thunks";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: true,
};

const chatslice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        addMessage : (state, action) => {
            state.messages.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isUserLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isUserLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isUserLoading = false;
                state.error = action.payload;
            });



        builder
            .addCase(getMessages.pending, (state) => {
                state.isMessageLoading = true;
                state.error = null;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isMessageLoading = false;
                state.messages =action.payload;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isMessageLoading = false;
                state.error = action.payload;
            });
    },



})

export const { selectedUser,addMessage, setSelectedUser, users, messages, isUserLoading } = chatslice.actions;
export default chatslice.reducer;