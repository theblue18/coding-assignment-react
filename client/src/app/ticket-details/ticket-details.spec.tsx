import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TicketDetails from './ticket-details';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Ticket, User } from '@acme/shared-models';
import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from '../reducers/ticketSlice';
import userReducer from '../reducers/userSlice';
import { unassignUserFromTicketApi } from '../apis/ticket';

// Mock data for users and tickets
const mockUsers: User[] = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
];

const mockTickets: Ticket[] = [
  { id: 1, description: 'Test Ticket 1', completed: false, assigneeId: 1 },
  { id: 2, description: 'Test Ticket 2', completed: true, assigneeId: null },
];

// Mocking API functions
jest.mock('../apis/ticket', () => ({
  unassignUserFromTicketApi: jest.fn().mockResolvedValue({ success: true }),
}));

// Configuring the mock store with preloaded state
const store = configureStore({
  reducer: {
    ticket: ticketsReducer,
    user: userReducer,
  },
  preloadedState: {
    ticket: {
      detailedTickets: mockTickets.map((ticket) => ({
        ticket,
        assignee:
          mockUsers.find((user) => user.id === ticket.assigneeId) || null,
      })),
      openCreateTicketModal: false,
      currentDetailedTicket: {
        ticket: mockTickets[0],
        assignee:
          mockUsers.find((user) => user.id === mockTickets[0].assigneeId) ||
          null,
      },
    },
    user: {
      users: mockUsers,
    },
  },
});

describe('TicketDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all previous mock calls and instances

    // Mocking window.matchMedia to avoid errors in environments without it
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    // Mocking the dispatch function for better test control
    store.dispatch = jest.fn();
  });

  test('displays ticket details correctly', async () => {
    // Renders the component and verifies that ticket details display as expected
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path="/:id" element={<TicketDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Waits for ticket details to load and checks that they appear correctly in the DOM
    await waitFor(() => {
      expect(screen.getByText(`#${mockTickets[0].id}`)).toBeInTheDocument();
      expect(screen.getByText(mockTickets[0].description)).toBeInTheDocument();
      expect(screen.getByText(mockUsers[0].name)).toBeInTheDocument();
    });
  });

  test('Unassign user from the ticket', async () => {
    // Renders the component and tests the unassign action on the ticket
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/1']}>
          <Routes>
            <Route path="/:id" element={<TicketDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Clicks on the unassign button to trigger the unassign action
    await waitFor(async () => {
      const unAssignedBtn = screen.getByLabelText('unAssignedBtn');
      fireEvent.click(unAssignedBtn);
    });

    // Verifies that the unassignUserFromTicketApi function was called with the correct ticket ID
    await waitFor(() => {
      expect(unassignUserFromTicketApi).toHaveBeenCalledWith(1);
    });

  });
});
