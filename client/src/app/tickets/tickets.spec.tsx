import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer, { setDetailedTickets } from '../reducers/ticketSlice';
import Tickets from './Tickets';
import { Ticket, User } from '@acme/shared-models';
import '@testing-library/jest-dom';

// Mock data for tickets and users
const mockTickets: Ticket[] = [
  { id: 1, description: 'Test Ticket 1', completed: false, assigneeId: 1 },
  { id: 2, description: 'Test Ticket 2', completed: true, assigneeId: 2 },
  { id: 3, description: 'Test Ticket 3', completed: false, assigneeId: null },
];

const mockUsers: User[] = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
];

describe('Tickets Component', () => {
  let store: any;

  beforeEach(() => {
    // Mock matchMedia for test environments
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Configure the store with preloaded state for tickets and users
    store = configureStore({
      reducer: {
        ticket: ticketsReducer,
      },
      preloadedState: {
        ticket: {
          detailedTickets: mockTickets.map((ticket) => ({
            ticket,
            assignee:
              mockUsers.find((user) => user.id === ticket.assigneeId) || null,
          })),
          openCreateTicketModal: false,
        },
      },
    });
    // Mock dispatch for testing dispatched actions
    store.dispatch = jest.fn();
  });

  it('displays tickets and users from preloaded state', async () => {
    // Render the Tickets component with the store and router
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Tickets />
        </MemoryRouter>
      </Provider>
    );

    // Verify that ticket descriptions and assignees are displayed correctly
    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument();
    expect(screen.getByText('Test Ticket 3')).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('filters tickets based on completion status', async () => {
    // Render the Tickets component
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Tickets />
        </MemoryRouter>
      </Provider>
    );

    // Set the store with mock ticket data
    store.dispatch(setDetailedTickets(mockTickets));

    // Locate the header for the "Completed" column using aria-label
    const completedHeader = screen.getByLabelText('completedHeader');
    // Find the filter icon within the same container div as the header
    const filterIcon = completedHeader
      .closest('div')
      ?.querySelector('[role="button"]');
    if (filterIcon) {
      fireEvent.click(filterIcon);
    }

    // Select the "Completed" filter option by its aria-label
    const completedOption = screen.getByLabelText('completedOption');
    fireEvent.click(completedOption);

    // Click the "OK" button to apply the filter
    const okButton = document.querySelector(
      '.ant-table-filter-dropdown button.ant-btn-primary'
    );
    fireEvent.click(okButton!);

    // Await the effect of filtering and verify the displayed tickets
    await waitFor(() => {
      expect(screen.queryByText('Test Ticket 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Ticket 2')).toBeInTheDocument();
      expect(screen.queryByText('Test Ticket 3')).not.toBeInTheDocument();
    });
  });
});
