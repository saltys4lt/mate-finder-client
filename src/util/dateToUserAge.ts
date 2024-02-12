import dayjs from 'dayjs';

export const dateToUserAge = (birthdate: string): number => {
  const ageInMonths = dayjs().diff(birthdate, 'months');

  const years = Math.floor(ageInMonths / 12);

  return years;
};
