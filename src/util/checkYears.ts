import dayjs from "dayjs";
import { Dayjs } from "dayjs";

export const checkYears = (birthdate: Dayjs): boolean => {
    const ageInMonths = dayjs().diff(birthdate, 'months');
  
    const years = Math.floor(ageInMonths / 12);
    const remainingMonths = ageInMonths % 12;
  
    return years >= 12 || (years === 11 && remainingMonths > 0);
  };