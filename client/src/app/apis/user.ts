import axios from "axios";
import { APIResponse } from "../types/api.types";

const baseUrl = `http://localhost:4200/api`;

/**
 * Retrieves all users from the backend API.
 *
 * @async
 * @function getAllUsersApi
 * @returns {Promise<APIResponse>} - An API response object containing the success status and users data if successful, or an error message if the request fails.
 */
export async function getAllUsersApi(): Promise<APIResponse> {
  return axios
    .get(`${baseUrl}/users`)
    .then(function (response) {
      if (!response.data) {
        return {
          message: "No data response",
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
