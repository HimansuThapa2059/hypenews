import { DateTime } from "luxon";

export const formatName = (name: string) => {
  if (!name) {
    return "";
  }

  const trimmedName = name.trim();
  const parts = trimmedName.split(/\s+/);
  const firstWord = parts[0];

  const MAX_LENGTH = 13;
  if (trimmedName.length <= MAX_LENGTH) {
    return trimmedName;
  }

  if (parts.length === 1) {
    return `${firstWord.substring(0, MAX_LENGTH - 3)}...`;
  }

  if (firstWord.length > MAX_LENGTH) {
    return `${firstWord.substring(0, MAX_LENGTH - 3)}...`;
  } else {
    const secondWord = parts[1];
    const firstTwoWords = `${firstWord} ${secondWord}`;

    if (firstTwoWords.length <= MAX_LENGTH) {
      return firstTwoWords;
    } else {
      return firstWord;
    }
  }
};

export const relativeTime = (date: string) => {
  const datetime = DateTime.fromISO(date);
  return datetime.toRelative();
};

export const getHostname = (url: string) => {
  try {
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    return new URL(normalizedUrl).hostname;
  } catch {
    return url;
  }
};
