/**
 * returns the distance between the beginning and the first char that is not the checkAgainstChar in form of a number.
 * @param checkAgainstChar defaults to `' '` should always be only one char.
 */
export function getDistance(text: string, checkAgainstChar: string = ' '): number {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char !== checkAgainstChar) {
      break;
    }
    count++;
  }
  return count;
}
/**
 * returns the distance between the end and the first char that is not the checkAgainstChar in form of a number.
 * @param checkAgainstChar defaults to `' '` should always be only one char.
 */
export function getDistanceReversed(text: string, checkAgainstChar: string = ' '): number {
  let count = 0;
  for (let i = text.length - 1; i > 0; i--) {
    const char = text[i];
    if (char !== checkAgainstChar) {
      break;
    }
    count++;
  }
  return count;
}
export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
