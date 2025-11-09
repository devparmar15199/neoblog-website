import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "@/types";

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationsState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
            state.loading = false;
            state.error = null;
            state.unreadCount = action.payload.filter(n => !n.is_read).length;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.is_read) {
                state.unreadCount += 1;
            }
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.is_read) {
                notification.is_read = true;
                state.unreadCount -= 1;
            }
        },
        markAllRead: (state) => {
            state.notifications.forEach(n => {
                n.is_read = true;
            });
            state.unreadCount = 0;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markAsRead,
    markAllRead,
    setLoading,
    setError
} = notificationsSlice.actions;
export default notificationsSlice.reducer;