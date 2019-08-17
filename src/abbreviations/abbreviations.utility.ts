import { TextDocument, WorkspaceEdit, workspace, window, Range, Position, SnippetString } from 'vscode';
import { normalize, join, basename, resolve, relative } from 'path';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { isVoidHtmlTag, isClassOrId } from '../utility/utility.regex';

export class AbbreviationsUtility {
  static getTabs(chars: number) {
    let tabs = '';
    for (let i = 0; i < chars; i++) {
      tabs = tabs.concat(' ');
    }
    return tabs;
  }

  static propRegex(firstLetter: string, secondary?: string, tertiary?: string) {
    let additional = '';
    if (secondary !== undefined) {
      additional = additional.concat(`[${secondary}]?`);
    }
    if (tertiary !== undefined) {
      additional = additional.concat(`[${tertiary}]?`);
    }
    return new RegExp(`^ ?${firstLetter}{1}${additional}`);
  }

  static htmlCommand(document: TextDocument, start: Position, endLine: number, previousText: string, tabSize) {
    const edit = new WorkspaceEdit();
    edit.replace(document.uri, new Range(start, new Position(endLine, previousText.length)), '');
    workspace
      .applyEdit(edit)
      .then(() =>
        window.activeTextEditor.insertSnippet(
          new SnippetString(AbbreviationsUtility._CREATE_HTML_SNIPPET_TEXT(AbbreviationsUtility._GET_HTML_STRUCTURE(document), tabSize)),
          start
        )
      );
  }
  static angularInit(document: TextDocument) {
    for (let i = 0; i < workspace.workspaceFolders.length; i++) {
      const path = workspace.workspaceFolders[i];
      if (existsSync(join(path.uri.fsPath, '/src/styles.sass'))) {
        const importPath = relative(join(document.uri.fsPath, '../'), join(path.uri.fsPath, 'src/styles.sass'));
        const rep = importPath.replace(/\\/g, '/');
        setTimeout(() => {
          if (document.lineAt(0).text !== `@import ${importPath.startsWith('.') ? rep : './'.concat(rep)}`) {
            const edit = new WorkspaceEdit();
            edit.insert(document.uri, new Position(0, 0), `@import ${importPath.startsWith('.') ? rep : './'.concat(rep)}\n`);
            workspace.applyEdit(edit);
          }
        }, 50);
      }
    }
  }
  static getDocumentClassesAndIds(document: TextDocument) {
    const classesAndIds: string[] = [];
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      if (isClassOrId(line.text)) {
        classesAndIds.push(line.text.trim());
      }
    }
    return classesAndIds;
  }

  private static _GET_HTML_STRUCTURE(document: TextDocument) {
    const path = normalize(join(document.fileName, '../', './'));
    const dir = readdirSync(path);
    const classesAndIds = this.getDocumentClassesAndIds(document);
    let tagArr: boolean[] = [];
    let previousResLength = 0;
    const res: { name: string; indentation: number }[] = [];
    for (const file of dir) {
      if (new RegExp(`${basename(document.fileName).replace('.sass', '.html')}`).test(file)) {
        const text = readFileSync(normalize(document.fileName).replace('.sass', '.html')).toString();
        const textLines = text.split('\n');
        let indentation = 0;
        for (let index = 0; index < textLines.length; index++) {
          const line = textLines[index];
          const tagParts = line.split('<');
          for (let i = 0; i < tagParts.length; i++) {
            const tagPart = tagParts[i];
            const tagPartName = tagPart.split(' ')[0].replace('>', '');
            const regex = /class="([\w ]*)"|id="(\w*)"/g;
            if (tagPart.trim() !== '' && !tagPart.startsWith('/')) {
              let m;
              while ((m = regex.exec(tagPart)) !== null) {
                if (m.index === regex.lastIndex) {
                  regex.lastIndex++;
                }
                m.forEach((match: string, groupIndex) => {
                  if (groupIndex !== 0 && match !== undefined) {
                    if (groupIndex === 1) {
                      const classes = match.split(' ');
                      classes.forEach(className => {
                        if (classesAndIds.find(value => value === '.'.concat(className)) === undefined) {
                          res.push({ name: '.'.concat(className), indentation: indentation });
                        }
                      });
                    } else {
                      if (classesAndIds.find(value => value === '#'.concat(match)) === undefined) {
                        res.push({ name: '#'.concat(match), indentation: indentation });
                      }
                    }
                  }
                });
              }

              tagArr.unshift(previousResLength !== res.length ? true && !isVoidHtmlTag(tagPartName) : false);
              previousResLength = res.length;
              if (tagArr[0] === true) {
                indentation++;
              }
            } else if (tagPart.startsWith('/')) {
              const currentTagPart = tagArr.shift();
              if (currentTagPart === true) {
                indentation--;
              }
            }
          }
        }
      }
    }
    return res;
  }
  private static _CREATE_HTML_SNIPPET_TEXT(tags: { name: string; indentation: number }[], tabSize) {
    let text = '';
    let pos = 0;
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      text = text.concat(
        this.replaceWithOffset(tag.name, tag.indentation * tabSize),
        '\n',
        `${this.replaceWithOffset('', (tag.indentation + 1) * tabSize)}$${(pos++, pos)}`,
        '\n'
      );
    }
    return text;
  }
  /**
   * adds or removes whitespace based on the given offset, a positive value adds whitespace a negative value removes it.
   */
  static replaceWithOffset(text: string, offset: number) {
    if (offset < 0) {
      text = text.replace(new RegExp(`^ {${Math.abs(offset)}}`), '');
    } else {
      let space = '';
      for (let i = 0; i < offset; i++) {
        space = space.concat(' ');
      }
      text = text.replace(/^/, space);
    }
    return text;
  }
}
