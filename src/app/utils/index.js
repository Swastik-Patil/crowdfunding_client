export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export function getDaysRemaining(timestamp) {
  // Convert seconds to milliseconds
  const futureDate = new Date(timestamp * 1000);

  // Get today's date
  const today = new Date();

  // Calculate the difference in milliseconds
  const differenceInMs = futureDate - today;

  // Convert milliseconds to days
  const daysRemaining = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

  return daysRemaining >= 0 ? daysRemaining : 0; // Return 0 if the date has already passed
}

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  img.onload = () => callback(true); // Call the callback with true if the image loads
  img.onerror = () => callback(false); // Call the callback with false if there is an error

  // Check if the image is already cached
  if (img.complete) callback(true);
};

export async function convertEthToBigInt(ethValue) {
  // Parse the input value as a float
  const ethAsFloat = parseFloat(ethValue);

  // Check if the input is valid
  if (isNaN(ethAsFloat) || ethAsFloat < 0) {
    throw new Error("Invalid ETH amount");
  }

  // Convert ETH to wei (1 ETH = 10^18 wei)
  const weiValue = ethAsFloat * 1e18;

  // Convert to bigint
  const bigintValue = BigInt(Math.round(weiValue));

  return bigintValue;
}
