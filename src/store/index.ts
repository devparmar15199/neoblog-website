import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import commentsReducer from "./slices/commentsSlice";
import themeReducer from "./slices/themeSlice";
import categoriesReducer from "./slices/categoriesSlice";
import tagsReducer from "./slices/tagsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import usersReducer from "./slices/usersSlice";
import socialReducer from "./slices/socialSlice";

// 1. Create the root reducer independently
const rootReducer = combineReducers({
    // --- Persisted Slices ---
    // We persist 'profile' so the user sees their avatar immediately
    auth: persistReducer(
        { key: 'auth', storage, whitelist: ['profile'] },
        authReducer
    ),

    theme: persistReducer(
        { key: 'theme', storage },
        themeReducer
    ),

    categories: persistReducer(
        { key: 'categories', storage, whitelist: ['categories'] },
        categoriesReducer
    ),

    tags: persistReducer(
        { key: 'tags', storage, whitelist: ['tags'] },
        tagsReducer
    ),

    // --- Non-Persisted Slices (Always fresh on reload) ---
    posts: postsReducer,
    comments: commentsReducer,
    notifications: notificationsReducer,
    users: usersReducer,
    social: socialReducer,
});

// 2. Configure Store
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Use the imported constants to ensure all persist actions are ignored correctly
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

// 3. Export Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;