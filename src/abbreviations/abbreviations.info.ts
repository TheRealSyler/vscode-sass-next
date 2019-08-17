export function getCharInfo(char: string, space: string): { text: string; lines: number } {
  if (char === undefined || char === '') {
    return { text: defaultText(space), lines: 3 };
  }
  switch (char) {
    case 'a':
      return { text: `${space}// l = all, c = align-content, s = align-self, i = align-items`, lines: 1 };
    case 'b':
      return {
        text: `${space}// g = background, u = bottom, s = box-shadow, z = box-sizing
${space}// ${directionSuggestions('border')}
${space}// d = box-decoration-break, a = border-radius, f = backface-visibility
${space}// Border Radius Directions, r = top-right, t = top-left, f = bottom-left, g = bottom-right`,
        lines: 4
      };
    case 'c':
      return {
        text: `${space}// l = clip, o = column-, s = columns, t = content, c = cursor 
${space}// i = counter-increment, r = counter-reset)`,
        lines: 2
      };
    case 'd':
      return { text: `${space}// r = direction`, lines: 1 };
    case 'F':
      return {
        text: `${space}// b = blur, r = brightness, c = contrast, d = drop-shadow, g = grayscale
${space}// h = hue-rotate, i = invert, o = opacity, s = saturate, e = sepia, u = url`,
        lines: 2
      };
    case 'f':
      return {
        text: `${space}// f = flex, b = flex-basis, d = flex-direction, o = flex-flow, g = flex-grow
${space}// h = flex-shrink, r = flex-wrap, l = float, a = font-family, k = font-kerning, s = font-size
${space}// j = font-size-adjust, t = font-stretch, y = font-style, v = font-variant, w = font-weight`,
        lines: 3
      };
    case 'g':
      return {
        text: `${space}// grid-**
${space}// a = area, u = auto-columns, f = auto-flow, w = auto-rows, l = column, n = column-, g = gap
${space}// o = row, i = row-, t = template, s = template-areas, c = template-columns, r = template-rows`,
        lines: 3
      };
    case 'h':
      return { text: `${space}// a = hanging-punctuation, y = hyphens`, lines: 1 };
    case 'j':
      return { text: `${space}// s = justify-self, i = justify-items`, lines: 1 };
    case 'l':
      return {
        text: `${space}// p = letter-spacing, h = line-height, s = list-style, i = list-style-image 
${space}// o = list-style-position, t list-style-type`,
        lines: 2
      };
    case 'm':
      return {
        text: `${space}// h = max-height, w = max-width, e = min-height, i = min-width, m = mix-blend-mode
// ${directionSuggestions('margin')}`,
        lines: 2
      };
    case 'o':
      return {
        text: `${space}// f = object-fit, p = object-position, a = opacity, r = order, u = outline
${space}// c = outline-color, o = outline-offset, s = outline-style, w = outline-width
${space}// y = overflow-y, x = overflow-x, w = overflow-wrap`,
        lines: 3
      };
    case 'p':
      return {
        text: `${space}// o = position, e = pointer-events, r = perspective, i = perspective-origin
${space}// a = page-break-after, b = page-break-before, s = page-break-inside
${space}// ${directionSuggestions('padding')})`,
        lines: 3
      };
    case 'r':
      return { text: `${space}// e = resize`, lines: 1 };
    case 't':
      return {
        text: `${space}// s = tab-size, a = text-align, d = text-decoration, i = text-indent
${space}// j = text-justify, h = text-shadow, r = text-transform, t = transition, o = text-overflow`,
        lines: 2
      };
    case 'T':
      return {
        text: `${space}// m = matrix, t = transform, s = scale, r = rotate, k = skew, p = perspective
${space}// (3 = 3d, x = X, y = Y, z = Z)`,
        lines: 2
      };
    case 'r':
      return { text: `${space}// u = unicode-bidi`, lines: 1 };
    case 'v':
      return { text: `${space}// a = vertical-align`, lines: 1 };
    case 'w':
      return { text: `${space}// s = white-space, b = word-break, p = word-spacing, w = word-wrap, m = writing-mode`, lines: 1 };
    default:
      return { text: defaultText(space), lines: 3 };
  }
}
function directionSuggestions(base: string) {
  return `l = ${base}-left, t = ${base}-top, r = ${base}-right, b = ${base}-bottom`;
}
const defaultText = (space: string) => `${space}// .** = class, #** = id, I** = @include, R = resets the indentation
${space}// M = @mixin, F = filter, T = Transform, ! = gets the classes and is from a html file with the same name in the same directory.
${space}// [a-z] = properties`;
