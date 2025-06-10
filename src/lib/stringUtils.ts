/**
 * Capitalizes the first letter of a string and converts the rest to lowercase
 * @param str - The string to capitalize
 * @returns The capitalized string
 * @example
 * capitalize("hello") // returns "Hello"
 * capitalize("HELLO") // returns "Hello"
 * capitalize("hELLO") // returns "Hello"
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}; 