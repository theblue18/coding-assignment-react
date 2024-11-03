import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../stores/stores';
import { Ticket, User } from '@acme/shared-models';
import { getUsers } from './userSlice';
import { DetailTicket } from '../types/common.types';

interface TicketState {
  detailedTickets?: DetailTicket[];
  openCreateTicketModal: boolean;
  currentDetailedTicket?: DetailTicket;
}

// Initial state for the ticket slice
const initialState: TicketState = {
  detailedTickets: undefined,
  openCreateTicketModal: false,
  currentDetailedTicket: undefined,
};

/**
 * Thunk to set detailed tickets by mapping Ticket[] to DetailTicket[].
 * Fetches user details from the store and associates each ticket with its assignee.
 */
export const setDetailedTickets = createAsyncThunk<
  DetailTicket[],
  Ticket[],
  { state: RootState }
>('ticket/setDetailedTickets', async (tickets, { getState }) => {
  const state = getState();
  const users = getUsers(state);

  const detailedTickets = tickets.map((ticket) => {
    const user = users?.find((u) => u.id === ticket.assigneeId) || null;
    return { ticket, assignee: user };
  });

  return detailedTickets;
});

/**
 * Thunk to add a single ticket and update detailedTickets.
 * Finds and associates the ticket's assignee with user data from the store.
 */
export const addDetailedTicket = createAsyncThunk<
  DetailTicket,
  Ticket,
  { state: RootState }
>('ticket/addDetailedTicket', async (ticket, { getState }) => {
  const state = getState();
  const users = getUsers(state);
  const assignee = users?.find((u) => u.id === ticket.assigneeId) || null;

  return { ticket, assignee };
});



export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    /**
     * Sets the state for the Create Ticket modal's visibility.
     * @param {TicketState} state - The current state of the ticket slice.
     * @param {PayloadAction<boolean>} action - Action payload to set modal visibility.
     */
    setOpenCreateTicketModal: (state, action: PayloadAction<boolean>) => {
      state.openCreateTicketModal = action.payload;
    },

    /**
     * Sets the current detailed ticket in the state.
     * @param {TicketState} state - The current state of the ticket slice.
     * @param {PayloadAction<DetailTicket | undefined>} action - Payload to set the detailed ticket.
     */
    setCurrentDetailedTicket: (
      state,
      action: PayloadAction<DetailTicket | undefined>
    ) => {
      state.currentDetailedTicket = action.payload;
    },

    /**
     * Updates the completion status of a ticket and sets it as the current detailed ticket.
     * @param {TicketState} state - The current state of the ticket slice.
     * @param {PayloadAction<{ ticketId: number; status: boolean }>} action - Payload containing the ticketId and status.
     */
    setStatusOfTicket: (
      state,
      action: PayloadAction<{ ticketId: number; status: boolean }>
    ) => {
      if (state.detailedTickets) {
        const index = state.detailedTickets.findIndex(
          (ticket) => ticket.ticket.id === action.payload.ticketId
        );
        const detailedTickets = [...state.detailedTickets];
        detailedTickets[index].ticket.completed = action.payload.status;
        state.detailedTickets = detailedTickets;
      }
      if (state.currentDetailedTicket) {
        const newCurrentDetailedTicket = { ...state.currentDetailedTicket };
        newCurrentDetailedTicket.ticket.completed = action.payload.status;
        state.currentDetailedTicket = newCurrentDetailedTicket;
      }
    },

    /**
     * Unassigns a user from a ticket by setting assignee and assigneeId to null.
     * Updates both detailedTickets and currentDetailedTicket.
     * @param {TicketState} state - The current state of the ticket slice.
     * @param {PayloadAction<number>} action - Payload containing the ticketId to unassign.
     */
    unassignUserFromTicket: (state, action: PayloadAction<number>) => {
      if (state.detailedTickets) {
        const index = state.detailedTickets.findIndex(
          (ticket) => ticket.ticket.id === action.payload
        );
        const detailedTickets = [...state.detailedTickets];
        detailedTickets[index].assignee = null;
        detailedTickets[index].ticket.assigneeId = null;
        state.detailedTickets = detailedTickets;
      }
      if (state.currentDetailedTicket) {
        const newCurrentDetailedTicket = { ...state.currentDetailedTicket };
        newCurrentDetailedTicket.assignee = null;
        newCurrentDetailedTicket.ticket.assigneeId = null;
        state.currentDetailedTicket = newCurrentDetailedTicket;
      }
    },
     /**
     * Add assignee to a ticket.
     * Updates both detailedTickets and currentDetailedTicket.
     * @param {TicketState} state - The current state of the ticket slice.
     * @param {PayloadAction<ticketId: number; user: User >} action - Payload containing the ticketId and user to assign.
     */
    addAssigneeToTicket: (
      state,
      action: PayloadAction<{ ticketId: number; user: User }>
    ) => {
      if (state.detailedTickets) {
        const index = state.detailedTickets.findIndex(
          (ticket) => ticket.ticket.id === action.payload.ticketId
        );
        const detailedTickets = [...state.detailedTickets];
        detailedTickets[index].assignee = action.payload.user;
        detailedTickets[index].ticket.assigneeId = action.payload.user.id;
        state.detailedTickets = detailedTickets;
      }
      if (state.currentDetailedTicket) {
        const newCurrentDetailedTicket = { ...state.currentDetailedTicket };
        newCurrentDetailedTicket.assignee = action.payload.user;
        newCurrentDetailedTicket.ticket.assigneeId = action.payload.user.id;
        state.currentDetailedTicket = newCurrentDetailedTicket;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      setDetailedTickets.fulfilled,
      (state, action: PayloadAction<DetailTicket[]>) => {
        state.detailedTickets = action.payload;
      }
    );
    builder.addCase(
      addDetailedTicket.fulfilled,
      (state, action: PayloadAction<DetailTicket>) => {
        if (state.detailedTickets) {
          state.detailedTickets.push(action.payload);
        } else {
          state.detailedTickets = [action.payload];
        }
      }
    );
  },
});

export const {
  setOpenCreateTicketModal,
  unassignUserFromTicket,
  setCurrentDetailedTicket,
  setStatusOfTicket,
  addAssigneeToTicket
} = ticketSlice.actions;

// Selectors
export const getDetailedTickets = (state: RootState) =>
  state.ticket.detailedTickets;
export const getCurrentDetailedTicket = (state: RootState) =>
  state.ticket.currentDetailedTicket;
export const getOpenCreateTicketModal = (state: RootState) =>
  state.ticket.openCreateTicketModal;

export default ticketSlice.reducer;
