export const formatDate = (timestamp: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const date = new Date(timestamp);
  return date.toLocaleDateString('ru-RU', options);
};
