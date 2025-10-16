/* eslint-disable prefer-destructuring */
// const colors = [
//   '#86CCFF',
//   '#FFC148',
//   '#FFA370',
//   '#FF525C',
//   '#CB4767',
//   '#6B1B38',
// ];

export const colors = [
  '#649AD3', // Moderately muted sky blue (#86CCFF)
  '#E6B951', // Soft golden (#FFC148)
  '#E89876', // Warm muted orange (#FFA370)
  '#D95557', // Muted coral red (#FF525C)
  '#AC5E7D', // Dusty magenta (#CB4767)
  '#783F58', // Muted deep plum (#6B1B38)
];

const colorNames = [
  'blue',
  'yellow',
  'orange',
  'brightRed',
  'darkerRed',
  'darkRed',
];

const getFillColor = (fillProb) => {
  let color, colorName;
  if (fillProb <= 0.025) {
    color = colors[0];
    colorName = colorNames[0];
  } else if (fillProb > 0.025 && fillProb <= 0.05) {
    color = colors[1];
    colorName = colorNames[1];
  } else if (fillProb > 0.05 && fillProb <= 0.15) {
    color = colors[2];
    colorName = colorNames[2];
  } else if (fillProb > 0.15 && fillProb <= 0.25) {
    color = colors[3];
    colorName = colorNames[3];
  } else if (fillProb > 0.25 && fillProb <= 0.4) {
    color = colors[4];
    colorName = colorNames[4];
  } else {
    color = colors[5];
    colorName = colorNames[5];
  }
  return { color, colorName };
};

export default getFillColor;
