import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import commentsReducer from "./slices/commentsSlice";
import themeReducer from "./slices/themeSlice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'theme'],
};

const rootReducer = {
    auth: persistReducer(persistConfig, authReducer),
    posts: postsReducer,
    comments: commentsReducer,
    theme: persistReducer(persistConfig, themeReducer),
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;