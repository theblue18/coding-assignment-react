import { User } from "@acme/shared-models";

const completedColor = '#87d068';
const inCompletedColor = '#f50';

const completedColorLabel = 'Completed';
const inCompletedColorLabel = 'InComplete';

/**
 * Returns an array of options for status selection, with labels, values, and colors.
 *
 * @returns {Array<{ label: string; value: boolean; color: string }>} Status options for dropdowns and select inputs.
 */
export const getStatusSelectOptions = () => {
  return [
    { label: completedColorLabel, value: true, color: completedColor },
    { label: inCompletedColorLabel, value: false, color: inCompletedColor },
  ];
};

/**
 * Retrieves the status option object based on a boolean value.
 *
 * @param {boolean} value - The status value, true for completed and false for incomplete.
 * @returns {{ label: string; value: boolean; color: string }} The status object containing label, value, and color.
 */
export const getStatusOptionFromValue = (value: boolean) => {
  if (value) {
    return { label: completedColorLabel, value: true, color: completedColor };
  } else {
    return {
      label: inCompletedColorLabel,
      value: false,
      color: inCompletedColor,
    };
  }
};

/**
 * Generates user selection options from a list of User objects.
 *
 * @param {User[] | undefined} users - The array of user objects to convert into select options.
 * @returns {Array<{ label: string; value: number }>} Array of user options for selection components.
 */
export const getUserSelectOptions = (users?: User[]) => {
  return users
    ? users.map((user) => {
        return { label: user.name, value: user.id };
      })
    : [];
};

/**
 * Checks if a given string is numeric (an integer).
 *
 * @param {string} value - The string to test.
 * @returns {boolean} True if the string is numeric, false otherwise.
 */
export const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value);
};
