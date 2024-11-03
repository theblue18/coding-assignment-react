/**
 * Redux store configuration and setup with persistence.
 *
 * This file defines the configuration of the Redux store, setting up state persistence
 * with `redux-persist` for specific reducers, and defining essential types for use throughout
 * the application.
 */

import type { ThunkAction, Action } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore,
} from "redux-persist"
import { persistReducer } from "redux-persist"
import { combineReducers } from "@reduxjs/toolkit"
import ticketReducer from "../reducers/ticketSlice"
import userReducer from "../reducers/userSlice"
import storage from "redux-persist/lib/storage"

/**
 * Root reducer that combines multiple slice reducers: `product`, `data`, and `cart`.
 */
const rootReducer = combineReducers({
  ticket: ticketReducer,
  user: userReducer

})

/**
 * Persistence configuration specifying which parts of the state should be persisted.
 *
 * @property {string} key - The root key for persisting the store.
 * @property {Storage} storage - The storage engine used, here set to `localStorage`.
 * @property {string[]} whitelist - Specifies `data` and `cart` slices for persistence.
 */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
}

/**
 * Wraps the root reducer with persistence capabilities using `persistReducer`.
 */
const persistedReducer = persistReducer(persistConfig, rootReducer)

/**
 * Configures and creates the Redux store with middleware.
 * Middleware is customized to handle non-serializable checks for `redux-persist` actions.
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

/**
 * Type representing the store's dispatch method.
 */
export type AppDispatch = typeof store.dispatch

/**
 * Type representing the shape of the root state based on reducers in the store.
 */
export type RootState = ReturnType<typeof store.getState>

/**
 * Type for asynchronous thunk actions with a default return type of `void`.
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

/**
 * Creates the persistor instance to persist and rehydrate the store.
 */
export const persistor = persistStore(store)
