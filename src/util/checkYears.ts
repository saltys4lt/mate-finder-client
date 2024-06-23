import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

export const checkYears = (birthdate: Dayjs): boolean => {
  const ageInYears = dayjs().diff(birthdate, 'year');

  return ageInYears >= 12;
};
