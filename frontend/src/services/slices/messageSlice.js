import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import { appApi } from "../appApi";
import {moneyParser} from "../../utils/formatters";

const messageAdapter = createEntityAdapter({
    selectId: (message) => message.id,
    sortComparer: (a, b) => b.timestamp.localeCompare(a.timestamp),
})

const initialState = messageAdapter.getInitialState({
    loading: false,
    error: null,
})


const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: messageAdapter.addOne,
        removeMessage: messageAdapter.removeOne,
        updateMessage: messageAdapter.updateOne,
        addManyMessages: messageAdapter.addMany,
        removeManyMessages: messageAdapter.removeMany,
        updateManyMessages: messageAdapter.updateMany,
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            appApi.endpoints.getMessages.matchFulfilled,
            (state,action) => {
                const items = Array.isArray(action.payload)
                    ? action.payload
                    : Array.isArray(action.payload?.data)
                        ? action.payload.data
                        : [];
                messageAdapter.setAll(state, items);
            }
        )
    }
})


export const messagesReducer = messageSlice.reducer;

export const {
    selectAll: selectAllMessages,
    selectById: selectMessageById,
    selectIds: selectMessageIds,
} = messageAdapter.getSelectors(state => state.messages);

export const selectAllMessagesMemo = createSelector(
    state => state.messages.ids,
    state => state.messages.entities,
    (ids, entities) => ids.map(id => entities[id])
);


export const {
    addMessage,
    removeMessage,
    updateMessage,
    addManyMessages,
    removeManyMessages,
    updateManyMessages,
} = messageSlice.actions;



export const selectGroupedMessages = createSelector(
    selectAllMessagesMemo,
    (messages) => {
        const chats = {};
        messages.forEach((message) => {
            const participantKey = [message.senderId, message.receiverId].sort().join('-');
            if (!chats[participantKey]) {
                chats[participantKey] = [];
            }
            chats[participantKey].push(message);
        });
        return chats;
    }
)