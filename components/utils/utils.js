export const isCursorDevice = () => {
  return !("ontouchstart" in window || navigator.maxTouchPoints);
};

export const getRandomPalette = (palette) => {
  return palette[Math.floor(Math.random() * palette.length)];
};
