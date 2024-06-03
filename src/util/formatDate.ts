export const formatDate = (timestamp: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const date = new Date(timestamp);
  return date.toLocaleDateString('ru-RU', options);
};

export const formatDateWithTime = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return date.toLocaleString('ru-RU', options);
};
