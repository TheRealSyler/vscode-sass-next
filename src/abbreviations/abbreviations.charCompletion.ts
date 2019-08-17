export const charCompletion = {
  appendDirection(secondKey: string, base: string) {
    switch (secondKey) {
      case 'l':
        return `${base}-left:`;
      case 't':
        return `${base}-top:`;
      case 'r':
        return `${base}-right:`;
      case 'b':
        return `${base}-bottom:`;
      default:
        return `${base}:`;
    }
  },
  getA(secondKey: string) {
    switch (secondKey) {
      case 'l':
        return `all:`;
      case 'c':
        return `align-content:`;
      case 's':
        return `align-self:`;
      case 'i':
        return `align-items:`;
      default:
        return `animation:`;
    }
  },
  getB(secondKey: string, thirdKey: string, base: string) {
    switch (secondKey) {
      case 'l':
        return `${base}-left:`;
      case 't':
        return `${base}-top:`;
      case 'r':
        return `${base}-right:`;
      case 'b':
        return `${base}-bottom:`;
      case 'g':
        return `background:`;
      case 'a':
        return borderThirdKey(base, thirdKey);
      case 'u':
        return `bottom:`;
      case 's':
        return `box-shadow:`;
      case 'z':
        return `box-sizing:`;
      case 'd':
        return `box-decoration-break:`;
      case 'v':
        return `backface-visibility:`;
      default:
        return `${base}:`;
    }
  },
  getC(secondKey: string) {
    switch (secondKey) {
      case 'l':
        return `clip:`;
      case 's':
        return `columns:`;
      case 'o':
        return `column-`;
      case 't':
        return `content:`;
      case 'i':
        return `counter-increment:`;
      case 'r':
        return `counter-reset:`;
      case 'c':
        return `cursor:`;
      default:
        return `color:`;
    }
  },
  getD(secondKey: string) {
    switch (secondKey) {
      case 'r':
        return `direction:`;
      default:
        return `display:`;
    }
  },
  getFilter(secondKey: string) {
    switch (secondKey) {
      case 'b':
        return `filter: blur()`;
      case 'r':
        return `filter: brightness()`;
      case 'c':
        return `filter: contrast()`;
      case 'd':
        return `filter: drop-shadow()`;
      case 'g':
        return `filter: grayscale()`;
      case 'h':
        return `filter: hue-rotate()`;
      case 'i':
        return `filter: invert()`;
      case 'o':
        return `filter: opacity()`;
      case 's':
        return `filter: saturate()`;
      case 'e':
        return `filter: sepia()`;
      case 'u':
        return `filter: url()`;
      default:
        return `filter:`;
    }
  },
  getF(secondKey: string) {
    switch (secondKey) {
      case 'f':
        return `flex:`;
      case 'b':
        return 'flex-basis:';
      case 'd':
        return 'flex-direction:';
      case 'o':
        return 'flex-flow:';
      case 'g':
        return 'flex-grow:';
      case 'h':
        return 'flex-shrink:';
      case 'r':
        return 'flex-wrap:';
      case 'l':
        return 'float:';
      case 'a':
        return 'font-family:';
      case 'k':
        return 'font-kerning:';
      case 's':
        return 'font-size:';
      case 'j':
        return 'font-size-adjust:';
      case 't':
        return 'font-stretch:';
      case 'y':
        return 'font-style:';
      case 'v':
        return 'font-variant:';
      case 'w':
        return 'font-weight:';
      default:
        return 'font:';
    }
  },
  getG(secondKey: string) {
    switch (secondKey) {
      case 'a':
        return `grid-area:`;
      case 'u':
        return 'grid-auto-columns:';
      case 'f':
        return 'grid-auto-flow:';
      case 'w':
        return 'grid-auto-rows:';
      case 'l':
        return 'grid-column:';
      case 'n':
        return 'grid-column-';
      case 'g':
        return 'grid-gap:';
      case 'o':
        return 'grid-row:';
      case 'i':
        return 'grid-row-';
      case 't':
        return 'grid-template:';
      case 's':
        return 'grid-template-areas:';
      case 'c':
        return 'grid-template-columns:';
      case 'r':
        return 'grid-template-rows:';
      default:
        return 'grid:';
    }
  },
  getH(secondKey: string) {
    switch (secondKey) {
      case 'a':
        return `hanging-punctuation:`;
      case 'y':
        return 'hyphens:';
      default:
        return 'height:';
    }
  },
  getJ(secondKey: string, base: string) {
    switch (secondKey) {
      case 's':
        return `${base}-self:`;
      case 'i':
        return `${base}-items:`;
      default:
        return `${base}-content:`;
    }
  },
  getL(secondKey: string) {
    switch (secondKey) {
      case 'p':
        return `letter-spacing:`;
      case 'h':
        return `line-height:`;
      case 's':
        return `list-style:`;
      case 'i':
        return `list-style-image:`;
      case 'o':
        return `list-style-position:`;
      case 't':
        return `list-style-type:`;
      default:
        return `left:`;
    }
  },
  getM(secondKey: string) {
    switch (secondKey) {
      case 'b':
        return `margin-bottom:`;
      case 'l':
        return `margin-left:`;
      case 'r':
        return `margin-right:`;
      case 't':
        return `margin-top:`;
      case 'h':
        return `max-height:`;
      case 'w':
        return `max-width:`;
      case 'e':
        return `min-height:`;
      case 'i':
        return `min-width:`;
      case 'm':
        return `mix-blend-mode:`;
      default:
        return `margin:`;
    }
  },
  getO(secondKey: string) {
    switch (secondKey) {
      case 'f':
        return `object-fit:`;
      case 'p':
        return `object-position:`;
      case 'a':
        return `opacity:`;
      case 'r':
        return `order:`;
      case 'u':
        return `outline:`;
      case 'c':
        return `outline-color:`;
      case 'o':
        return `outline-offset:`;
      case 's':
        return `outline-style:`;
      case 'w':
        return `outline-width:`;
      case 'y':
        return `overflow-y:`;
      case 'x':
        return `overflow-x:`;
      case 'w':
        return `overflow-wrap:`;
      default:
        return `overflow:`;
    }
  },
  getP(secondKey: string) {
    switch (secondKey) {
      case 'b':
        return `padding-bottom:`;
      case 'l':
        return `padding-left:`;
      case 'r':
        return `padding-right:`;
      case 't':
        return `padding-top:`;
      case 'a':
        return `page-break-after:`;
      case 'b':
        return `page-break-before:`;
      case 's':
        return `page-break-inside:`;
      case 'r':
        return `perspective:`;
      case 'i':
        return `perspective-origin:`;
      case 'e':
        return `pointer-events:`;
      case 'o':
        return `position:`;
      default:
        return `padding:`;
    }
  },
  getR(secondKey: string) {
    switch (secondKey) {
      case 'e':
        return `resize:`;
      default:
        return `right:`;
    }
  },
  getT(secondKey: string) {
    switch (secondKey) {
      case 's':
        return `tab-size:`;
      case 'a':
        return `text-align:`;
      case 'd':
        return `text-decoration:`;
      case 'i':
        return `text-indent:`;
      case 'j':
        return `text-justify:`;
      case 'h':
        return `text-shadow:`;
      case 'o':
        return `text-overflow:`;
      case 'r':
        return `text-transform:`;
      case 't':
        return `transition:`;
      default:
        return `top:`;
    }
  },
  getTransform(secondKey: string, thirdKey: string) {
    switch (secondKey) {
      case 'm':
        return transformExtensions('transform', 'matrix', thirdKey, ['3']);
      case 't':
        return transformExtensions('transform', 'translate', thirdKey, ['3', 'x', 'y', 'z']);
      case 's':
        return transformExtensions('transform', 'scale', thirdKey, ['3', 'x', 'y', 'z']);
      case 'r':
        return transformExtensions('transform', 'rotate', thirdKey, ['3', 'x', 'y', 'z']);
      case 'k':
        return transformExtensions('transform', 'skew', thirdKey, ['x', 'y']);
      case 'p':
        return `transform: perspective`;

      default:
        return `transform:`;
    }
  },
  getU(secondKey: string) {
    switch (secondKey) {
      case 'u':
        return `unicode-bidi:`;
      default:
        return `user-select:`;
    }
  },
  getV(secondKey: string) {
    switch (secondKey) {
      case 'a':
        return `vertical-align:`;
      default:
        return 'visibility:';
    }
  },
  getW(secondKey: string) {
    switch (secondKey) {
      case 's':
        return `white-space:`;
      case 'b':
        return `word-break:`;
      case 'p':
        return `word-spacing:`;
      case 'w':
        return `word-wrap:`;
      case 'm':
        return `writing-mode:`;
      default:
        return 'width:';
    }
  }
};

function transformExtensions(base: string, funcName: string, thirdKey: string, allow?: string[]) {
  if (allow !== undefined) {
    if (allow.indexOf(thirdKey) === -1) {
      return `${base}: ${funcName}()`;
    }
  }
  switch (thirdKey) {
    case '3':
      return `${base}: ${funcName}3d()`;
    case 'x':
      return `${base}: ${funcName}X()`;
    case 'y':
      return `${base}: ${funcName}Y()`;
    case 'z':
      return `${base}: ${funcName}Z()`;
    default:
      return `${base}: ${funcName}()`;
  }
}
function borderThirdKey(base: string, thirdKey: string) {
  switch (thirdKey) {
    case 't':
      return `${base}-top-left-radius:`;
    case 'r':
      return `${base}-top-right-radius:`;
    case 'f':
      return `${base}-bottom-left-radius:`;
    case 'g':
      return `${base}-bottom-right-radius:`;
    default:
      return `${base}-radius:`;
  }
}
