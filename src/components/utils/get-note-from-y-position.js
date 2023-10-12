export const getNoteFromYPosition = (yPosition) => {
  const lowerLimit = -300;
  const upperLimit = 300;

  const clampedY = Math.max(lowerLimit, Math.min(upperLimit, yPosition));

  // 逆の音階順で12音階まで増やしました。
  const scaleNotes = ["E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3"];
  const noteIndex = Math.min(scaleNotes.length - 1, Math.floor(((clampedY - lowerLimit) / (upperLimit - lowerLimit)) * scaleNotes.length));

  return scaleNotes[noteIndex];
};
