
export const formatCurrency = (number: number) => {
  const sign = Math.sign(number);
  // Convert the number to a string and remove sign
  const numStr = (number * sign).toString();

  // Check for the presence of a decimal part
  const [integer, decimal] = numStr.split(".");

  // Reverse the integer part to facilitate the insertion of dots
  const reversed = integer.split("").reverse().join("");

  // Insert a dot every three characters
  const withDots = reversed.match(/.{1,3}/g)?.join(".");

  // Reverse it back to normal
  const formatted = withDots?.split("").reverse().join("");

  // Add euro sign and reattach the decimal part if it exists and minus sign
  return `€ ${sign === -1 ? '-' : ''}${formatted}${decimal ? `.${decimal}` : ''}`;
}