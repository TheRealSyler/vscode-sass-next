import { isClassOrId, isInclude } from '../utility/utility.regex';

const timingFunction = 'ease,linear,ease-in,ease-out,ease-in-out,step-start,step-end,steps(),cubic-bezier(),initial,inherit';
export function generateSnippetText(text: string): string {
  const arr = text.split('\n');
  const newArr = [];
  let pos = 0;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (isClassOrId(item) || isInclude(item)) {
      newArr.push(item);
    } else {
      switch (item.trim()) {
        case 'animation:':
          newArr.push(
            `${item} $\{${(pos++, pos)}:name} $\{${(pos++, pos)}:250ms} $\{${(pos++, pos)}|${timingFunction}|} $\{${(pos++,
            pos)}:delay} $\{${(pos++, pos)}:iteration-count} $\{${(pos++, pos)}:direction} $\{${(pos++, pos)}:fill-mode} $\{${(pos++,
            pos)}:play-state}`
          );
          break;
        case 'all:':
          newArr.push(`${item} $\{${(pos++, pos)}|initial,inherit,unset|}`);
          break;
        case 'justify-self:':
        case 'align-self:':
          newArr.push(`${item} $\{${(pos++, pos)}|auto,stretch,center,flex-start,flex-end,baseline|}`);
          break;
        case 'align-content:':
        case 'justify-content:':
          newArr.push(`${item} $\{${(pos++, pos)}|stretch,center,flex-start,flex-end,space-between,space-around|}`);
          break;
        case 'justify-items:':
        case 'align-items:':
          newArr.push(`${item} $\{${(pos++, pos)}|stretch,center,flex-start,flex-end,baseline|}`);
          break;
        case 'border:':
        case 'border-left:':
        case 'border-right:':
        case 'border-top:':
        case 'border-bottom:':
        case 'outline-style:':
          newArr.push(
            `${item} $\{${(pos++, pos)}:1px} $\{${(pos++, pos)}|solid,none,dotted,double,groove,ridge,inset,outset,hidden|} $\{${(pos++,
            pos)}:red}`
          );
          break;

        case 'box-shadow:':
          newArr.push(
            `${item} $\{${(pos++, pos)}:h-offset} $\{${(pos++, pos)}:v-offset} $\{${(pos++, pos)}:blur} $\{${(pos++,
            pos)}:spread} $\{${(pos++, pos)}:color}`
          );
          break;
        case 'box-sizing:':
          newArr.push(`${item} $\{${(pos++, pos)}|content-box,border-box,initial,inherit|}`);
          break;
        case 'cursor:':
          newArr.push(
            `${item} $\{${(pos++,
            pos)}|pointer,none,default,auto,text,vertical-text,no-drop,alias,URL,all-scroll,cell,context-menu,col-resize,copy,crosshair,grab,grabbing,help,move,e-resize,ew-resize,n-resize,ne-resize,nesw-resize,ns-resize,nw-resize,nwse-resize,not-allowed,progress,row-resize,s-resize,se-resize,w-resize,wait,zoom-in,zoom-out,initial,inherit|}`
          );
          break;
        case 'column-':
          newArr.push(`${item}$\{${(pos++, pos)}|fill: ,gap: ,rule: ,rule-color: ,rule-style: ,rule-width: ,span: ,width: |}`);
          break;
        case 'columns:':
          newArr.push(`${item} $\{${(pos++, pos)}|auto,10px|} $\{${(pos++, pos)}:column-count}`);
          break;
        case 'display:':
          newArr.push(
            `${item} $\{${(pos++,
            pos)}|flex,none,block,inline,inline-block,grid,inline-flex,inline-grid,inline-table,list-item,run-in,table,initial,inherit,contents,table-caption,table-column-group,table-header-group,table-footer-group,table-row-group,table-cell,table-column,table-row|}`
          );
          break;
        case 'direction:':
          newArr.push(`${item} $\{${(pos++, pos)}|ltr,rtl|}`);
          break;
        case 'empty-cells:':
          newArr.push(`${item} $\{${(pos++, pos)}|show,hide|}`);
          break;
        case 'filter: blur()':
          newArr.push(`${item.replace(')', '')} $\{${(pos++, pos)}:10px} )`);
          break;
        case 'filter: brightness()':
          newArr.push(`${item.replace(')', '')} $\{${(pos++, pos)}:120%} )`);
          break;
        case 'filter: contrast()':
          newArr.push(`${item.replace(')', '')} $\{${(pos++, pos)}:120%} )`);
          break;
        case 'filter: drop-shadow()':
          newArr.push(
            `${item.replace(')', '')} $\{${(pos++, pos)}:h-shadow} $\{${(pos++, pos)}:v-shadow} $\{${(pos++, pos)}:blur} $\{${(pos++,
            pos)}:spread} $\{${(pos++, pos)}:color} )`
          );
          break;
        case 'filter: grayscale()':
          newArr.push(`${item.replace(')', '')} $\{${(pos++, pos)}:100%} )`);
          break;
        case 'filter: hue-rotate()':
          newArr.push(`${item.replace(')', '')} $\{${(pos++, pos)}:180deg} )`);
          break;
        case 'filter: opacity()':
          newArr.push(`${item.replace(')', '')} $\{${(pos++, pos)}:50%} )`);
          break;
        case 'filter: saturate()':
          newArr.push(`${item.replace(')', '')} $\{${(pos++, pos)}:120%} )`);
          break;
        case 'filter: sepia()':
          newArr.push(`${item.replace(')', '')} $\{${(pos++, pos)}:50%} )`);
          break;
        case 'filter: url()':
          newArr.push(`${item.replace(')', '')} $${(pos++, pos)} )`);
          break;
        case 'flex:':
          newArr.push(`${item} $\{${(pos++, pos)}:grow} $\{${(pos++, pos)}:shrink} $\{${(pos++, pos)}:basis}`);
          break;
        case 'flex-direction:':
          newArr.push(`${item} $\{${(pos++, pos)}|row,row-reverse,column,column-reverse|}`);
          break;
        case 'flex-flow:':
          newArr.push(`${item} $\{${(pos++, pos)}|row,row-reverse,column,column-reverse|} $\{${(pos++, pos)}|nowrap,wrap,wrap-reverse|}`);
          break;
        case 'flex-wrap:':
          newArr.push(`${item} $\{${(pos++, pos)}|nowrap,wrap,wrap-reverse|}`);
          break;
        case 'float:':
          newArr.push(`${item} $\{${(pos++, pos)}|none,left,right|}`);
          break;
        case 'font:':
          newArr.push(
            `${item} $\{${(pos++, pos)}:style} $\{${(pos++, pos)}:variant} $\{${(pos++, pos)}:weight} $\{${(pos++,
            pos)}:size/height} $\{${(pos++, pos)}:family}`
          );
          break;
        case 'font-kerning:':
          newArr.push(`${item} $\{${(pos++, pos)}|auto,normal,none|}`);
          break;
        case 'font-size:':
          newArr.push(`${item} $\{${(pos++, pos)}|medium,xx-small,x-small,small,large,x-large,xx-large,smaller,larger|}`);
          break;
        case 'font-stretch:':
          newArr.push(
            `${item} $\{${(pos++,
            pos)}|ultra-condensed,extra-condensed,condensed,semi-condensed,normal,semi-expanded,expanded,extra-expanded,ultra-expanded|}`
          );
          break;
        case 'font-style:':
          newArr.push(`${item} $\{${(pos++, pos)}|normal,italic,oblique|}`);
          break;
        case 'font-variant:':
          newArr.push(`${item} $\{${(pos++, pos)}|normal,small-caps|}`);
          break;
        case 'font-weight:':
          newArr.push(`${item} $\{${(pos++, pos)}|normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900|}`);
          break;
        case 'grid:':
          newArr.push(`${item} $\{${(pos++, pos)}:template-rows} $\{${(pos++, pos)}:template-columns} $\{${(pos++, pos)}:template-areas}`);
          break;
        case 'grid-auto-rows:':
        case 'grid-auto-columns:':
          newArr.push(`${item} $\{${(pos++, pos)}|auto,max-content,min-content|}`);
          break;
        case 'grid-row-':
        case 'grid-column-':
          newArr.push(`${item}$\{${(pos++, pos)}|end: ,gap: ,start: |}`);
          break;
        case 'grid-auto-flow:':
          newArr.push(`${item} $\{${(pos++, pos)}|row,column,dense,row dense,column|}`);
          break;
        case 'hanging-punctuation:':
          newArr.push(`${item} $\{${(pos++, pos)}|none,first,last,allow-end,force-end|}`);
          break;
        case 'hyphens:':
          newArr.push(`${item} $\{${(pos++, pos)}|none,manual,auto|}`);
          break;
        case 'isolation:':
          newArr.push(`${item} $\{${(pos++, pos)}|auto,isolate|}`);
          break;
        case '@mixin':
          newArr.push(`@mixin $\{${(pos++, pos)}:name} ($${(pos++, pos)})\n\t$${(pos++, pos)}`);
          break;
        case 'list-style':
          newArr.push(`${item} $\{${(pos++, pos)}:type} $\{${(pos++, pos)}:position} $\{${(pos++, pos)}:image}`);
          break;
        case 'list-style-position:':
          newArr.push(`${item} $\{${(pos++, pos)}|inside,outside|}`);
          break;
        case 'mix-blend-mode:':
          newArr.push(
            `${item} $\{${(pos++,
            pos)}|normal,multiply,screen,overlay,darken,lighten,color-dodge,color-burn,difference,exclusion,hue,saturation,color,luminosity|}`
          );
          break;
        case 'object-fit:':
          newArr.push(`${item} $\{${(pos++, pos)}|fill,contain,cover,scale-down,none|}`);
          break;
        case 'outline:':
          newArr.push(`${item} $\{${(pos++, pos)}:none}`);
          break;
        case 'outline-width:':
          newArr.push(`${item} $\{${(pos++, pos)}|medium,thin,thick|}`);
          break;
        case 'overflow:':
        case 'overflow-y:':
        case 'overflow-x:':
          newArr.push(`${item} $\{${(pos++, pos)}|hidden,scroll,visible,auto|}`);
          break;
        case 'overflow-wrap:':
          newArr.push(`${item} $\{${(pos++, pos)}|normal,break-word|}`);
          break;
        case 'page-break-after:':
        case 'page-break-before:':
        case 'page-break-inside:':
          newArr.push(`${item} $\{${(pos++, pos)}|auto,always,avoid,left,right|}`);
          break;
        case 'pointer-events:':
          newArr.push(`${item} $\{${(pos++, pos)}|none,auto|}`);
          break;
        case 'position:':
          newArr.push(`${item} $\{${(pos++, pos)}|absolute,relative,fixed,sticky,static|}`);
          break;
        case 'resize:':
          newArr.push(`${item} $\{${(pos++, pos)}|none,both,horizontal,vertical|}`);
          break;
        case 'scroll-behavior:':
          newArr.push(`${item} $\{${(pos++, pos)}|auto,smooth|}`);
          break;
        case 'text-align:':
          newArr.push(`${item} $\{${(pos++, pos)}|left,right,center,justify|}`);
          break;
        case 'text-decoration:':
          newArr.push(`${item} $\{${(pos++, pos)}:line}  $\{${(pos++, pos)}:color} $\{${(pos++, pos)}:style}`);
          break;
        case 'text-justify:':
          newArr.push(`${item} $\{${(pos++, pos)}|auto,inter-word,inter-character,none|}`);
          break;
        case 'text-overflow:':
          newArr.push(`${item} $\{${(pos++, pos)}|clip,ellipsis|}`);
          break;
        case 'text-overflow:':
          newArr.push(`${item} $\{${(pos++, pos)}|capitalize,uppercase,lowercase,none|}`);
          break;
        case 'transition:':
          newArr.push(`${item} $\{${(pos++, pos)}:all} $\{${(pos++, pos)}:250ms} $\{${(pos++, pos)}|${timingFunction}|}`);
          break;
        case 'transform: matrix()':
        case 'transform: matrix3d()':
        case 'transform: translate()':
        case 'transform: translate3d()':
        case 'transform: translateY()':
        case 'transform: translateX()':
        case 'transform: translateZ()':
        case 'transform: scale()':
        case 'transform: scale3d()':
        case 'transform: scaleY()':
        case 'transform: scaleX()':
        case 'transform: scaleZ()':
        case 'transform: rotate()':
        case 'transform: rotate3d()':
        case 'transform: rotateY()':
        case 'transform: rotateX()':
        case 'transform: rotateZ()':
        case 'transform: skew()':
        case 'transform: skewX()':
        case 'transform: skewY()':
          newArr.push(`${item.replace(')', '')} $${(pos++, pos)} )`);
          break;
        case 'unicode-bidi:':
          newArr.push(`${item} $\{${(pos++, pos)}|normal,embed,bidi-override|}`);
          break;
        case 'user-select:':
          newArr.push(`${item} $\{${(pos++, pos)}|none,auto,text,all|}`);
          break;
        case 'vertical-align:':
          newArr.push(`${item} $\{${(pos++, pos)}|baseline,sub,super,top,text-top,middle,bottom,text-bottom|}`);
          break;
        case 'visibility:':
          newArr.push(`${item} $\{${(pos++, pos)}|visible,hidden,collapse|}`);
          break;
        case 'white-space:':
          newArr.push(`${item} $\{${(pos++, pos)}|normal,nowrap,pre,pre-line,pre-wrap|}`);
          break;
        case 'word-break:':
          newArr.push(`${item} $\{${(pos++, pos)}|normal,break-all,keep-all,break-word|}`);
          break;
        case 'word-wrap:':
          newArr.push(`${item} $\{${(pos++, pos)}|normal,break-word|}`);
          break;
        case 'writing-mode:':
          newArr.push(`${item} $\{${(pos++, pos)}|horizontal-tb,vertical-rl,vertical-lr|}`);
          break;
        case 'top: 0':
        case 'bottom: 0':
        case 'left: 0':
        case 'right: 0':
          newArr.push(item);
          break;
        default:
          newArr.push(`${item} $${(pos++, pos)}`);
          break;
      }
    }
  }
  return newArr.join('\n').concat('\n');
}
