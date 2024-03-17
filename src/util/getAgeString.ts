export const getAgeString = (age: number) => {
  if (age === 1 || age % 10 === 1) {
    return age + ' год';
  } else if ((age >= 2 && age <= 4) || (age % 10 >= 2 && age % 10 <= 4)) {
    return age + ' года';
  } else {
    return age + ' лет';
  }
};
