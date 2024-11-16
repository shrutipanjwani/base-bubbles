export default function truncateAddress(
  fullAddress: string | undefined
): string {
  if (!fullAddress) {
    return "Undefined";
  }

  const prefix = fullAddress.substring(0, 6); // Take the first 6 characters
  const suffix = fullAddress.substring(fullAddress.length - 4); // Take the last 4 characters
  return `${prefix}...${suffix}`; // Combine them with ellipsis in the middle
}
