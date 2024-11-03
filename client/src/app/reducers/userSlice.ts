import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../stores/stores";
import { User } from "@acme/shared-models";

/**
 * Represents the state structure for user within the application.
 * 
 * @typedef {Object} UserState
 * @property {User[] | undefined} users - An optional array of users.
 */
interface UserState {
  users?: User[];
}

// Define the initial state using the UserState type
const initialState: UserState = {
  users: undefined,
};

/**
 * Slice for managing user-related state.
 * Provides actions and reducers for modifying the user slice of the state.
 */
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Sets the users in the state.
     * 
     * @function setUsers
     * @param {UserState} state - The current state of the user slice.
     * @param {PayloadAction<User[]>} action - The action payload containing an array of users.
     */
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
});

// Exporting the setUsers action for dispatching to update the state
export const { setUsers } = userSlice.actions;

/**
 * Selector to retrieve the users from the data state.
 * 
 * @function getUsers
 * @param {RootState} state - The root state of the Redux store.
 * @returns {User[] | undefined} - The array of users or undefined if not set.
 */
export const getUsers = (state: RootState) => state.user.users;

// Export the reducer to be used in store configuration
export default userSlice.reducer;
