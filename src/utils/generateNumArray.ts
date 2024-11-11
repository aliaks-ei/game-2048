/**
 * Generate an array of numbers from 0 to length - 1
 * @param length Length of the array
 * @returns Array of numbers
 */
export const generateNumArray = (length: number) => {
  return Array.from({ length }, (_, index) => index);
};
