/**
 * Color palette for probability visualization
 */
export const colors = [
  '#649AD3',
  '#E6B951',
  '#E89876',
  '#D95557',
  '#AC5E7D',
  '#783F58',
];

const colorNames = [
  'blue',
  'yellow',
  'orange',
  'brightRed',
  'darkerRed',
  'darkRed',
];

// Probability thresholds for color assignment
const COLOR_THRESHOLDS = [
  { max: 0.025, index: 0 },
  { max: 0.05, index: 1 },
  { max: 0.15, index: 2 },
  { max: 0.25, index: 3 },
  { max: 0.4, index: 4 },
  { max: Infinity, index: 5 },
];

/**
 * Gets fill color and color name based on probability value
 * @param {number} fillProb - Probability value (0-1)
 * @returns {{ color: string, colorName: string }} Color hex code and name
 */
export const getFillColor = (fillProb) => {
  const threshold = COLOR_THRESHOLDS.find((t) => fillProb <= t.max);
  const index = threshold?.index ?? 5;
  return {
    color: colors[index],
    colorName: colorNames[index],
  };
};
