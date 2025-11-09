import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import commentsReducer from "./slices/commentsSlice";
import themeReducer from "./slices/themeSlice";
import categoriesReducer from "./slices/categoriesSlice";
import tagsReducer from "./slices/tagsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import usersReducer from "./slices/usersSlice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'theme', 'categories', 'tags'],
};

// Separate persist reducers
const persistedAuthReducer = persistReducer(
    // { ...persistConfig, key: 'auth', whitelist: ['user', 'profile'] },
    { ...persistConfig, key: 'auth', whitelist: ['user', 'profile'] },
    authReducer
);

const persistedThemeReducer = persistReducer(
    { ...persistConfig, key: 'theme' },
    themeReducer
);

const persistedCategoriesReducer = persistReducer(
    { ...persistConfig, key: 'categories', whitelist: ['categories'] },
    categoriesReducer
);

const persistedTagsReducer = persistReducer(
    { ...persistConfig, key: 'tags', whitelist: ['tags'] },
    tagsReducer
);

const rootReducer = {
    auth: persistedAuthReducer,
    posts: postsReducer,
    comments: commentsReducer,
    notifications: notificationsReducer,
    theme: persistedThemeReducer,
    categories: persistedCategoriesReducer,
    tags: persistedTagsReducer,
    users: usersReducer,
};

export const store = configureStore({
    reducer: rootReducer,
    // Fix the serializability check to correctly exclude persist actions
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/PURGE', 'persist/FLUSH'],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;