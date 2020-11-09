/* eslint-disable import/prefer-default-export */

// https://stackoverflow.com/questions/8069315/create-array-of-all-integers-between-two-numbers-inclusive-in-javascript-jquer/8069367
export const getYearRange = (start, end) => {
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
};
