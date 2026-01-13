import { format, formatDistance, parseISO, isValid } from "date-fns";
import { id, enUS } from "date-fns/locale";

export const formatDate = (
  date: Date | string,
  formatString: string = "dd/MM/yyyy"
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return "Invalid date";
  }

  return format(dateObj, formatString, { locale: id });
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return "Invalid date";
  }

  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: id,
  });
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, "dd/MM/yyyy HH:mm");
};

export const formatTime = (date: Date | string): string => {
  return formatDate(date, "HH:mm");
};

export const formatDateWithLanguage = (
  date: Date | string,
  language: string = "en"
): string => {
  // Ensure we have a valid date object
  let dateObj: Date;

  if (typeof date === "string") {
    dateObj = parseISO(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    // Handle case where date might be serialized from Prisma
    dateObj = new Date(date);
  }

  if (!isValid(dateObj)) {
    return "Invalid date";
  }

  // Use safer format strings and proper locale
  const formatString = language === "id" ? "dd MMMM yyyy" : "d MMMM yyyy";
  const locale = language === "id" ? id : enUS;

  try {
    return format(dateObj, formatString, { locale });
  } catch (error) {
    console.error("Date formatting error:", error, { date, language });
    // Fallback to ISO string if formatting fails
    return dateObj.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};
