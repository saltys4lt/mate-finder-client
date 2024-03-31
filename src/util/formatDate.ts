export const formatDate = (timestamp: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('ru-RU', options);
};
