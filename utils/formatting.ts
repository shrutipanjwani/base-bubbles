// utils/formatting.ts
export const formatProjectName = (name: string): string => {
  return (
    name
      // Split by underscore or hyphen
      .split(/[_-]/)
      // Capitalize first letter of each word
      .map((word) =>
        // Handle version numbers (v1, v2, v3, etc.)
        word.match(/^v\d+$/)
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      // Join with spaces
      .join(" ")
  );
};

interface FormattedLabel {
  line1: string;
  line2: string;
}

const formatTwoLineLabel = (name: string): FormattedLabel => {
  const words = formatProjectName(name).split(" ");

  if (words.length === 2) {
    return {
      line1: words[0],
      line2: words[1],
    };
  }

  if (words.length > 2) {
    const midpoint = Math.ceil(words.length / 2);
    return {
      line1: words.slice(0, midpoint).join(" "),
      line2: words.slice(midpoint).join(" "),
    };
  }

  return {
    line1: words[0],
    line2: "",
  };
};
