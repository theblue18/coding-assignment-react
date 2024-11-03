import { Ticket, User } from '@acme/shared-models';

/**
 * Represents a detailed ticket, including assignee details.
 *
 * @typedef {Object} DetailTicket
 * @property {Ticket} ticket - The main details of the ticket.
 * @property {User | null} assignee - The user assigned to the ticket, or null if unassigned.
 */
export type DetailTicket = {
  ticket: Ticket;
  assignee: User | null;
};

/**
 * Represents the data structure for creating a new ticket.
 *
 * @typedef {Object} CreateTicketFieldType
 * @property {string} description - The description of the ticket to be created.
 */
export type CreateTicketFieldType = {
  description: string;
};
