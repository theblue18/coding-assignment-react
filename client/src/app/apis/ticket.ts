import axios from 'axios';

import { CreateTicketFieldType } from '../types/common.types';
import { APIResponse } from '../types/api.types';

const baseUrl = `http://localhost:4200/api`;

/**
 * Retrieves all tickets from the backend API.
 *
 * @async
 * @function getAllTicketsApi
 * @returns {Promise<APIResponse>} - An API response object containing the success status and tickets data, or an error message.
 */
export async function getAllTicketsApi(): Promise<APIResponse> {
  return axios
    .get(`${baseUrl}/tickets`)
    .then(function (response) {
      if (!response.data) {
        return {
          message: 'No data response',
          success: false,
        } as APIResponse;
      }
      return {
        success: true,
        data: response.data,
      } as APIResponse;
    })
    .catch(function (error) {
      return {
        message: error.message,
        success: false,
      } as APIResponse;
    });
}

/**
 * Fetches a specific ticket by its ID.
 *
 * @async
 * @function getTicketApi
 * @param {number} ticketId - The unique ID of the ticket to retrieve.
 * @returns {Promise<APIResponse>} - An API response with success status and ticket data or an error message.
 */
export async function getTicketApi(ticketId: number): Promise<APIResponse> {
  return axios
    .get(`${baseUrl}/tickets/${ticketId}`)
    .then(function (response) {
      if (!response.data) {
        return {
          message: 'No data response',
          success: false,
        } as APIResponse;
      }
      return {
        success: true,
        data: response.data,
      } as APIResponse;
    })
    .catch(function (error) {
      return {
        message: error.message,
        success: false,
      } as APIResponse;
    });
}

/**
 * Creates a new ticket using the provided data fields.
 *
 * @async
 * @function createTicketApi
 * @param {CreateTicketFieldType} data - The data fields required to create a ticket.
 * @returns {Promise<APIResponse>} - An API response indicating the success of the operation and the created ticket's data.
 */
export async function createTicketApi(
  data: CreateTicketFieldType
): Promise<APIResponse> {
  return axios
    .post(`${baseUrl}/tickets`, data)
    .then(function (response) {
      if (!response.data) {
        return {
          message: 'No data response',
          success: false,
        } as APIResponse;
      }
      return {
        success: true,
        data: response.data,
      } as APIResponse;
    })
    .catch(function (error) {
      return {
        message: error.message,
        success: false,
      } as APIResponse;
    });
}

/**
 * Assigns a user to a ticket.
 *
 * @async
 * @function assignUserToTicketApi
 * @param {number} ticketId - The ID of the ticket to assign.
 * @param {number} userId - The ID of the user to be assigned to the ticket.
 * @returns {Promise<APIResponse>} - An API response indicating the success of the assignment operation.
 */
export async function assignUserToTicketApi(
  ticketId: number,
  userId: number
): Promise<APIResponse> {
  return axios
    .put(`${baseUrl}/tickets/${ticketId}/assign/${userId}`)
    .then(function (response) {
      if (response.status === 204) {
        return {
          success: true,
          data: response.data,
        } as APIResponse;
      } else {
        return {
          message: 'API Error',
          success: false,
        } as APIResponse;
      }
    })
    .catch(function (error) {
      return {
        message: error.message,
        success: false,
      } as APIResponse;
    });
}

/**
 * Unassigns a user from a ticket.
 *
 * @async
 * @function unassignUserFromTicketApi
 * @param {number} ticketId - The ID of the ticket to unassign a user from.
 * @returns {Promise<APIResponse>} - An API response indicating the success of the unassignment operation.
 */
export async function unassignUserFromTicketApi(
  ticketId: number
): Promise<APIResponse> {
  return axios
    .put(`${baseUrl}/tickets/${ticketId}/unassign`)
    .then(function (response) {
      if (response.status === 204) {
        return {
          success: true,
          data: response.data,
        } as APIResponse;
      } else {
        return {
          message: 'API Error',
          success: false,
        } as APIResponse;
      }
    })
    .catch(function (error) {
      return {
        message: error.message,
        success: false,
      } as APIResponse;
    });
}

/**
 * Marks a ticket as completed.
 *
 * @async
 * @function markTicketAsCompleteApi
 * @param {number} ticketId - The ID of the ticket to mark as completed.
 * @returns {Promise<APIResponse>} - An API response indicating the success of marking the ticket as complete.
 */
export async function markTicketAsCompleteApi(
  ticketId: number
): Promise<APIResponse> {
  return axios
    .put(`${baseUrl}/tickets/${ticketId}/complete`)
    .then(function (response) {
      if (response.status === 204) {
        return {
          success: true,
          data: response.data,
        } as APIResponse;
      } else {
        return {
          message: 'API Error',
          success: false,
        } as APIResponse;
      }
    })
    .catch(function (error) {
      return {
        message: error.message,
        success: false,
      } as APIResponse;
    });
}

/**
 * Marks a ticket as incomplete.
 *
 * @async
 * @function markTicketAsIncompleteApi
 * @param {number} ticketId - The ID of the ticket to mark as incomplete.
 * @returns {Promise<APIResponse>} - An API response indicating the success of marking the ticket as incomplete.
 */
export async function markTicketAsIncompleteApi(
  ticketId: number
): Promise<APIResponse> {
  return axios
    .delete(`${baseUrl}/tickets/${ticketId}/complete`)
    .then(function (response) {
      if (response.status === 204) {
        return {
          success: true,
          data: response.data,
        } as APIResponse;
      } else {
        return {
          message: 'API Error',
          success: false,
        } as APIResponse;
      }
    })
    .catch(function (error) {
      return {
        message: error.message,
        success: false,
      } as APIResponse;
    });
}
