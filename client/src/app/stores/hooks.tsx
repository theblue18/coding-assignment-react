/**
 * Custom hooks for typed Redux state selection and dispatching actions.
 *
 * These hooks provide a safer and more convenient way to access Redux state and dispatch actions in
 * TypeScript-based applications by inferring the types directly from the store configuration.
 */

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./stores";

/**
 * Custom hook to dispatch actions in the app with the correct `AppDispatch` type.
 * Use this throughout the app instead of `useDispatch` for better TypeScript support.
 *
 * @returns {AppDispatch} - The typed dispatch function.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Custom hook to select state from the Redux store with the correct `RootState` type.
 * Use this throughout the app instead of `useSelector` for better TypeScript support.
 *
 * @type {TypedUseSelectorHook<RootState>}
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
