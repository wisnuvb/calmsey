import { format, formatDistance, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

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
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return "Invalid date";
  }

  const formatString = language === "id" ? "dd MMMM yyyy" : "MMMM dd, yyyy";
  const locale = language === "id" ? id : undefined;

  return format(dateObj, formatString, { locale });
};
