import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

export const getYears = (birthdate: Dayjs): number => {
  const ageInMonths = dayjs().diff(birthdate, 'months');

  const years: number = Math.floor(ageInMonths / 12);

  return years;
};
