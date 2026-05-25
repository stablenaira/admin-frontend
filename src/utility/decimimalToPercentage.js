export function decimalToPercentage(value, decimals = 0, returnAsString = true) {
  // Handle invalid input
  if (value === null || value === undefined || isNaN(value)) {
    return returnAsString ? "0%" : 0;
  }

  // Convert decimal (0-1) to percentage (0-100)
  const percentage = (value * 100).toFixed(decimals);

  return returnAsString ? `${percentage}%` : parseFloat(percentage);
}
