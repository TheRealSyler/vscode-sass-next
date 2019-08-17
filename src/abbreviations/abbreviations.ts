import { SnippetString, window, workspace, WorkspaceEdit, TextDocument, Position, Range } from 'vscode';
import { getDistance } from '../utility/utility';
import { generateSnippetText } from './abbreviations.getSnippetText';
import { getCharInfo } from './abbreviations.info';
import { charCompletion as CharComp } from './abbreviations.charCompletion';
import { AbbreviationsUtility as Utility } from './abbreviations.utility';
// is active avoids that Abbreviations gets called twice in a row.
let isActive = false;
export function Abbreviations(document: TextDocument, start: Position, currentWord: string) {
  if (isActive === false) {
    const inputBox = window.createInputBox();
    const tabSize = window.activeTextEditor.options.tabSize || 4;

    inputBox.title = 'SASS Abbreviations';
    inputBox.placeholder = 'Abbreviations';
    inputBox.show();
    console.log('SASS Abbreviations', isActive);
    isActive = true;
    const initialEmptySpace = Utility.getTabs(getDistance(currentWord));
    const defaultCharInfo = getCharInfo('', initialEmptySpace);
    let previousText = defaultCharInfo.text.concat('\n');
    let commandsText = '';
    let endLine = start.line + defaultCharInfo.lines;
    // Init
    const InitialEdit = new WorkspaceEdit();
    InitialEdit.replace(document.uri, new Range(start, new Position(start.line, initialEmptySpace.length + 1)), previousText);
    workspace.applyEdit(InitialEdit);
    //
    inputBox.onDidChangeValue(valueChange);

    function valueChange(value: string) {
      let commands = value.split(',');
      const charInfo = getCharInfo(commands[commands.length - 1][0], initialEmptySpace);
      let tabs = initialEmptySpace;

      if (commands[0][0] === '!') {
        inputBox.dispose();
        Utility.htmlCommand(document, start, endLine, previousText, tabSize);
      } else if (commands[0][0] === '"') {
        inputBox.dispose();
        setTimeout(() => {
          Utility.htmlCommand(document, start, endLine, previousText, tabSize);
        }, 0);
        Utility.angularInit(document);
      } else {
        for (let i = 0; i < commands.length; i++) {
          let command = commands[i];
          // Get KEYS
          let key = command[0];
          let secondKey = command[1];
          let thirdKey = command[2];
          if (command.startsWith(' ')) {
            key = command[1];
            secondKey = command[2];
          }
          //-----------------------------
          let addTab = false;
          let resetTab = false;
          switch (key) {
            // SECTION Special.
            case 'M':
              addTab = true;
              command = command.replace(/^ ?M{1}/, '@mixin');
              break;
            case '#':
              addTab = true;
              break;
            case '.':
              addTab = true;
              break;
            case '*':
              addTab = true;
              break;
            case 'I':
              command = command.replace(/^ ?I{1}/, '');
              command = '@include'.concat(command);
              break;
            case 'D':
              inputBox.value = inputBox.value.replace(/ ?D{1}$/, '').concat('t 0,bu 0,r 0,l 0');
              setTimeout(() => valueChange(inputBox.value), 10);
              break;
            case 'R':
              resetTab = true;
              command = command.replace(/^ ?R{1}$/, '');
              break;
            // - !SECTION
            // SECTION properties
            case 'a':
              command = command.replace(Utility.propRegex('a', 'lcsi'), CharComp.getA(secondKey));
              break;
            case 'b':
              command = command.replace(Utility.propRegex('b', 'lrtbgvdbszua', 'trfg'), CharComp.getB(secondKey, thirdKey, 'border'));
              break;
            case 'c':
              command = command.replace(Utility.propRegex('c', 'lostirc'), CharComp.getC(secondKey));
              break;
            case 'd':
              command = command.replace(Utility.propRegex('d', 'r'), CharComp.getD(secondKey));
              break;
            case 'e':
              command = command.replace(Utility.propRegex('e'), 'empty-cells:');
              break;
            case 'f':
              command = command.replace(Utility.propRegex('f', 'fbdoghrlaksjtyvw'), CharComp.getF(secondKey));
              break;
            case 'F':
              command = command.replace(Utility.propRegex('F', 'brcdghioseu'), CharComp.getFilter(secondKey));
              break;
            case 'g':
              command = command.replace(Utility.propRegex('g', 'aufwlngoitscr'), CharComp.getG(secondKey));
              break;
            case 'h':
              command = command.replace(Utility.propRegex('h', 'ay'), CharComp.getH(secondKey));
              break;
            case 'i':
              command = command.replace(Utility.propRegex('i'), 'isolation:');
              break;
            case 'j':
              command = command.replace(Utility.propRegex('j', 'si'), CharComp.getJ(secondKey, 'justify'));
              break;
            case 'l':
              command = command.replace(Utility.propRegex('l', 'phsiot'), CharComp.getL(secondKey));
              break;
            case 'm':
              command = command.replace(Utility.propRegex('m', 'blrthweim'), CharComp.getM(secondKey));
              break;
            case 'o':
              command = command.replace(Utility.propRegex('o', 'fparucoswyxw'), CharComp.getO(secondKey));
              break;
            case 'p':
              command = command.replace(Utility.propRegex('p', 'blrtabsrieo'), CharComp.getP(secondKey));
              break;
            case 'q':
              command = command.replace(Utility.propRegex('q'), 'quotes:');
              break;
            case 'r':
              command = command.replace(Utility.propRegex('r', 'e'), CharComp.getR(secondKey));
              break;
            case 's':
              command = command.replace(Utility.propRegex('s'), 'scroll-behavior:');
              break;
            case 't':
              command = command.replace(Utility.propRegex('t', 'sadijhrto'), CharComp.getT(secondKey));
              break;
            case 'T':
              command = command.replace(Utility.propRegex('T', 'mtsrkp', '3xyz'), CharComp.getTransform(secondKey, thirdKey));
              break;
            case 'u':
              command = command.replace(Utility.propRegex('u', 'u'), CharComp.getU(secondKey));
              break;
            case 'v':
              command = command.replace(Utility.propRegex('v', 'a'), CharComp.getV(secondKey));
              break;
            case 'w':
              command = command.replace(Utility.propRegex('w', 'sbpwm'), CharComp.getW(secondKey));
              break;
            case 'z':
              command = command.replace(Utility.propRegex('z'), 'z-index:');
              break;
            // - !SECTION
          }

          command = tabs.concat(command);

          commands[i] = command;

          if (resetTab) {
            tabs = '';
          }

          if (addTab) {
            tabs = tabs.concat('\t');
          }
        }
        const insertText = charInfo.text.concat('\n', commands.join('\n'));
        const edit = new WorkspaceEdit();
        edit.replace(document.uri, new Range(start, new Position(endLine, previousText.length)), insertText);
        workspace.applyEdit(edit);
        endLine = start.line + commands.length - 1 + charInfo.lines;
        previousText = insertText;
        commandsText = commands.join('\n');
      }
    }
    inputBox.onDidAccept(() => {
      inputBox.dispose();
      isActive = false;
      commandsText = generateSnippetText(commandsText);

      const edit = new WorkspaceEdit();

      edit.replace(document.uri, new Range(start, new Position(endLine, commandsText.length)), '');
      workspace.applyEdit(edit).then(() => {
        window.activeTextEditor.insertSnippet(new SnippetString(commandsText), start);
      });
    });
    inputBox.onDidHide(() => {
      inputBox.dispose();
      isActive = false;
      const edit = new WorkspaceEdit();
      edit.replace(document.uri, new Range(start, new Position(endLine, previousText.length)), '');
      workspace.applyEdit(edit);
    });
  }
}
