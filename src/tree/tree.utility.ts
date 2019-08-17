import { workspace, TreeItemCollapsibleState as ColState, window, SnippetString, Uri, TextDocument, env } from 'vscode';
import { readFileSync, existsSync, writeFile, writeFileSync } from 'fs';
import { join, basename } from 'path';
import { SassTreeItemData, SassTreeItem, SassTreeItemType } from './tree.item';
import { SnippetProviderUtility as provider } from './tree.provider';
import { isVar, isMixin } from '../utility/utility.regex';

class SassTreeItemDataRaw {
  constructor(
    public type: SassTreeItemType,
    public position: number,
    public insert?: string,
    public desc?: string,
    public isOpen?: boolean
  ) {}
}

interface TreeData {
  [item: string]: { data: SassTreeItemDataRaw; children: TreeData };
}
interface FileLocation {
  path: string;
}

export class TreeUtility {
  /**
   * Stores the absolute path for each root folder;
   */
  private static _FILE_LOCATIONS: { [name: string]: FileLocation } = {};
  private static _DATA: TreeData;
  private static _COPY: { data: TreeData['any']; name: string };
  private static _INITIALIZED = false;
  private constructor() {}
  static getDataFromFile() {
    this._DATA = {};
    const folders = workspace.workspaceFolders;
    if (folders !== undefined) {
      folders.forEach((folderPath, i) => {
        const path = join(folderPath.uri.fsPath, '.vscode', 'sass.snippets.json');
        if (existsSync(path)) {
          const rawData = readFileSync(path);
          this._FILE_LOCATIONS[folderPath.name] = { path };
          this._DATA = {
            ...this._DATA,
            ...{ [folderPath.name]: { children: JSON.parse(rawData.toString()), data: { type: 'root', isOpen: true, position: i + 1 } } }
          };
        }
      });
    }
    const globalPath: string = workspace.getConfiguration().get('sass.snippets.path');
    if (globalPath && globalPath !== 'none') {
      if (existsSync(globalPath)) {
        const rawData = readFileSync(globalPath);
        this._FILE_LOCATIONS['Global'] = { path: globalPath };
        this._DATA = {
          ...this._DATA,
          ...{ ['Global']: { children: JSON.parse(rawData.toString()), data: { type: 'root', isOpen: true, position: 0 } } }
        };
      } else {
        window.showWarningMessage(`${globalPath} does not exist!`, 'Create new File', 'Reset Setting').then(value => {
          switch (value) {
            case 'Create new File':
              if (/.json/.test(globalPath)) {
                writeFileSync(globalPath, '{}');
              } else {
                window.showErrorMessage('Path Has to end with .json', 'Chose New Path').then(value => {
                  if (value === 'Chose New Path') {
                    this._GET_GLOBAL_PATH(true);
                  }
                });
              }
              break;
            case 'Reset Setting':
              workspace.getConfiguration().update('sass.snippets.path', 'none', true);
              break;

            default:
              break;
          }
        });
      }
    } else {
      this._GET_GLOBAL_PATH();
    }
    this._INITIALIZED = true;
    return this._DATA;
  }

  static getItems(data: TreeData, path?: string[]): SassTreeItem[] {
    const items: SassTreeItem[] = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const item = data[key];
        let isFolder = false;
        if (item.data.type === 'folder' || item.data.type === 'root') {
          isFolder = true;
        }
        items.push(
          new SassTreeItem(
            key,
            new SassTreeItemData(item.data.insert, item.data.type, this._CREATE_PATH(key, path), item.data.position, item.data.desc),
            isFolder ? (item.data.isOpen ? ColState.Expanded : ColState.Collapsed) : ColState.None
          )
        );
      }
    }
    items.sort((a, b) => a.data.position - b.data.position);
    return items;
  }
  static getData(path?: string[]) {
    if (path !== undefined) {
      return this._DOES_PATH_EXIST(path).data;
    } else {
      return this._DATA;
    }
  }

  static addFromSelection(item: SassTreeItem) {
    if (window.activeTextEditor !== undefined && window.activeTextEditor.document !== undefined) {
      if (!this._INITIALIZED) {
        this.getDataFromFile();
      }
      const document = window.activeTextEditor.document;
      const selections = window.activeTextEditor.selections;
      let newItems: SassTreeItemDataRaw[] = [];
      for (let i = 0; i < selections.length; i++) {
        const selection = document.getText(selections[i]);
        if (selection.length > 0) {
          newItems.push(new SassTreeItemDataRaw('snippet', 0, selection));
        }
      }
      for (let i = 0; i < newItems.length; i++) {
        const newItem = newItems[i];

        let itemName = `Selection${i === 0 ? '' : '-'.concat(i.toString())}`;
        let path: string[];
        let counter = 0;
        if (item && item.data !== undefined) {
          path = item.data.path;
        } else {
          const config = workspace.getConfiguration().get('sass.snippets.path');
          if (config !== '' && config !== 'none') {
            path = ['Global'];
          } else {
            path = [workspace.getWorkspaceFolder(document.uri).name];
          }
        }
        while (this._DOES_PATH_EXIST(path.concat([itemName])).exists === true) {
          counter++;
          itemName = `Selection-${i + counter}`;
        }

        newItem.position = this._GET_POSITION(path);

        this._INSERT_DATA(path, { [itemName]: { data: newItem, children: {} } });
        this._WRITE_DATA_TO_FILES({ location: this._FILE_LOCATIONS[path[0]], baseName: path[0] });
        provider.Refresh();
      }
    }
  }
  static delete(item: SassTreeItem) {
    this._DELETE_DATA(item.data.path);
    provider.Refresh();
    this._WRITE_DATA_TO_FILES({ location: this._FILE_LOCATIONS[item.data.path[0]], baseName: item.data.path[0] });
  }
  static edit(item: SassTreeItem) {
    window.showInputBox({ placeHolder: 'newName' }).then(value => {
      if (value) {
        const newPath = item.data.path.slice(0, item.data.path.length - 1).concat(value);
        if (!this._DOES_PATH_EXIST(newPath).exists) {
          let deletedData = this._DELETE_DATA(item.data.path);
          provider.Refresh();
          this._INSERT_DATA(item.data.path.slice(0, item.data.path.length - 1), { [value]: deletedData });
          this._WRITE_DATA_TO_FILES({ location: this._FILE_LOCATIONS[item.data.path[0]], baseName: item.data.path[0] });
        } else {
          window.showWarningMessage(`name: ${value} already in use.`);
        }
      }
    });
  }

  static move(item: SassTreeItem, direction: 'up' | 'down') {
    if (direction === 'up' ? item.data.position + 1 >= 0 : true) {
      const path = item.data.path.slice(0, item.data.path.length - 1);
      const itemData = this.getData(path)[item.label].data;
      const write = this._UPDATE_ITEM_POSITIONS(path, { data: itemData, name: item.label }, direction);
      if (write) {
        this._WRITE_DATA_TO_FILES({ location: this._FILE_LOCATIONS[item.data.path[0]], baseName: item.data.path[0] });
        provider.Refresh();
      }
    }
  }
  static copy(item: SassTreeItem) {
    this._COPY = { data: this.getData(item.data.path.slice(0, item.data.path.length - 1))[item.label], name: item.label };
  }
  static cut(item: SassTreeItem) {
    this._COPY = { data: this._DELETE_DATA(item.data.path), name: item.label };
    provider.Refresh();
  }

  static paste(item: SassTreeItem) {
    if (!this._DOES_PATH_EXIST(item.data.path.concat(this._COPY.name)).exists) {
      this._PASTE(item);
    } else {
      window.showWarningMessage(`item: ${this._COPY.name} already exists, do you want to overwrite it?`, 'Yes', 'No').then(value => {
        if (value === 'Yes') {
          this._PASTE(item);
        }
      });
    }
  }

  static addFolder(item: SassTreeItem) {
    window.showInputBox({ placeHolder: 'Folder Name' }).then(value => {
      if (value) {
        const newPath = item.data.path.concat(value);
        if (!this._DOES_PATH_EXIST(newPath).exists) {
          this._INSERT_DATA(item.data.path, {
            [value]: { children: {}, data: { type: 'folder', position: this._GET_POSITION(item.data.path) } }
          });
          provider.Refresh();
          this._WRITE_DATA_TO_FILES({ location: this._FILE_LOCATIONS[item.data.path[0]], baseName: item.data.path[0] });
        } else {
          window.showWarningMessage(`folder: ${value} already exists.`);
        }
      }
    });
  }
  static insert(item: SassTreeItem) {
    if (window.activeTextEditor) {
      let counter = 0;
      const insert = item.data.insert.replace(/(\\?\${?N)/g, function(_, grp) {
        return grp[0] === '\\' ? grp : grp.replace(/^\${?N$/, `$${grp[1] === '{' ? '{' : ''}${(counter++, counter)}`);
      });
      window.activeTextEditor.insertSnippet(new SnippetString(insert.concat('\n')));
    }
  }
  static insertFolder(item: SassTreeItem) {
    if (window.activeTextEditor) {
      const data = this.getData(item.data.path);
      let items = '';
      let counter = 0;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const item = data[key];
          if (item.data && item.data.insert) {
            const insert = item.data.insert.replace(/(\\?\${?N)/g, function(_, grp) {
              return grp[0] === '\\' ? grp : grp.replace(/^\${?N$/, `$${grp[1] === '{' ? '{' : ''}${(counter++, counter)}`);
            });

            items = items.concat(insert.concat('\n'));
          }
        }
      }
      window.activeTextEditor.insertSnippet(new SnippetString(items));
    }
  }
  static openFile(item: SassTreeItem) {
    window.showTextDocument(Uri.file(this._FILE_LOCATIONS[item.data.path[0]].path));
  }

  static recalculatePosition(item: SassTreeItem) {
    const path = item.data.path;
    let level = 0;
    let pos = 0;
    path.reduce((lastReturnValue, currentKey) => {
      level++;
      if (level === path.length) {
        for (const key in lastReturnValue[currentKey].children) {
          if (lastReturnValue[currentKey].children.hasOwnProperty(key)) {
            lastReturnValue[currentKey].children[key].data.position = pos;
            pos++;
          }
        }
        return lastReturnValue[currentKey];
      } else {
        return lastReturnValue[currentKey].children;
      }
    }, this._DATA);

    this._WRITE_DATA_TO_FILES({ location: this._FILE_LOCATIONS[item.data.path[0]], baseName: item.data.path[0] });
    provider.Refresh();
  }
  static pasteFromClipboard() {
    env.clipboard.readText().then(text => {
      console.log('clipboard', text);
    });
  }
  static addFromFile(item: SassTreeItem, type: 'both' | 'mixin' | 'var') {
    if (window.activeTextEditor !== undefined && window.activeTextEditor.document !== undefined) {
      const document = window.activeTextEditor.document;
      const baseName = basename(document.fileName);

      const itemsRaw = TreeUtility._SCAN_FILE(document);

      let items: { vars: { name: string; data: SassTreeItemDataRaw }[]; mixin: { name: string; data: SassTreeItemDataRaw }[] } = {
        vars: [],
        mixin: []
      };
      let path = [];
      if (item && item.data !== undefined) {
        path = item.data.path;
      } else {
        const config = workspace.getConfiguration().get('sass.snippets.path');
        if (config !== '' && config !== 'none') {
          path = ['Global'];
        } else {
          path = [workspace.getWorkspaceFolder(document.uri).name];
        }
      }
      let pos = 0;
      for (const key in itemsRaw) {
        if (itemsRaw.hasOwnProperty(key)) {
          const item = itemsRaw[key];
          if (item.type === 'mixin' && type !== 'var') {
            items.mixin.push({
              data: new SassTreeItemDataRaw('snippet', pos, item.insert, item.desc),
              name: item.name
            });
            pos++;
          } else if (item.type === 'var' && type !== 'mixin') {
            items.vars.push({
              data: new SassTreeItemDataRaw('snippet', pos, item.insert, item.desc),
              name: item.name
            });
            pos++;
          }
        }
      }
      let folderName = baseName;
      let counter = 0;
      while (this._DOES_PATH_EXIST(path.concat([folderName])).exists === true) {
        counter++;
        folderName = `${baseName}-${counter}`;
      }
      const desc = type === 'both' ? '' : type === 'mixin' ? '.Mixins' : '.Variables';
      let res: TreeData;
      switch (type) {
        case 'both':
          res = {
            [folderName]: {
              children: {
                Variables: { children: {}, data: { position: 0, type: 'folder' } },
                Mixins: { children: {}, data: { position: 1, type: 'folder' } }
              },
              data: { type: 'folder', position: this._GET_POSITION(path) }
            }
          };
          items.mixin.reduce(accumulator, res[folderName].children.Mixins.children);
          items.vars.reduce(accumulator, res[folderName].children.Variables.children);
          break;
        case 'mixin':
          res = {
            [folderName.concat(desc)]: {
              children: {},
              data: { type: 'folder', position: this._GET_POSITION(path) }
            }
          };
          items.mixin.reduce(accumulator, res[folderName.concat(desc)].children);
          break;
        case 'var':
          res = {
            [folderName.concat(desc)]: {
              children: {},
              data: { type: 'folder', position: this._GET_POSITION(path) }
            }
          };
          items.vars.reduce(accumulator, res[folderName.concat(desc)].children);
          break;
      }
      function accumulator(acc: TreeData, currentItem: { name: string; data: SassTreeItemDataRaw }) {
        acc[currentItem.name] = { data: currentItem.data, children: {} };
        return acc;
      }
      this._INSERT_DATA(path, res);
      this._WRITE_DATA_TO_FILES({ location: this._FILE_LOCATIONS[path[0]], baseName: path[0] });
      provider.Refresh();
    }
  }
  private static _SCAN_FILE(document: TextDocument) {
    const items: { insert: string; name: string; type: 'var' | 'mixin'; desc: string }[] = [];
    let isInMixin = false;
    let currentMixin = '';
    let currentMixinName = '';

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      const lineText = line.text.trim();
      if (isVar(line.text)) {
        const varSplit = lineText.split(':');
        items.push({
          insert: lineText.replace('$', '\\$'),
          name: varSplit[0],
          desc: varSplit[1].trim(),
          type: 'var'
        });
      } else if (isMixin(lineText)) {
        if (isInMixin === true) {
          pushMixin();
        }
        currentMixinName = lineText
          .split('(')[0]
          .replace('@mixin', '')
          .trim();
        currentMixin = currentMixin.concat(lineText);
        isInMixin = true;
      } else if (!line.isEmptyOrWhitespace && /^[@#\.]/.test(line.text)) {
        if (isInMixin) {
          pushMixin();
          isInMixin = false;
        }
      } else if (isInMixin && !line.isEmptyOrWhitespace) {
        currentMixin = currentMixin.concat('\n', line.text);
      }
    }
    if (isInMixin) {
      pushMixin();
    }
    function pushMixin() {
      items.push({ name: '@'.concat(currentMixinName), desc: '', insert: currentMixin, type: 'mixin' });
      currentMixin = '';
      currentMixinName = '';
    }
    return items;
  }

  private static _PASTE(item: SassTreeItem) {
    this._INSERT_DATA(item.data.path, {
      [this._COPY.name]: {
        children: this._COPY.data.children,
        data: {
          type: this._COPY.data.data.type,
          position: Object.keys(this.getData(item.data.path)).length,
          desc: this._COPY.data.data.desc,
          insert: this._COPY.data.data.insert,
          isOpen: this._COPY.data.data.isOpen
        }
      }
    });

    this._WRITE_DATA_TO_FILES({ location: this._FILE_LOCATIONS[item.data.path[0]], baseName: item.data.path[0] });
    provider.Refresh();
  }
  private static _GET_POSITION(path: string[]) {
    return Object.keys(this.getData(path)).length;
  }

  private static _GET_GLOBAL_PATH(skipQuestion?: boolean) {
    if (skipQuestion) {
      window.showOpenDialog({ openLabel: 'Set Snippet Path', canSelectFiles: false, canSelectFolders: true }).then(res => {
        if (res) {
          workspace.getConfiguration().update('sass.snippets.path', res[0].fsPath.concat('/sass-snippets.json'), true);
          writeFileSync(res[0].fsPath.concat('/sass-snippets.json'), '{}');
          provider.Refresh(true);
        }
      });
    } else {
      window.showInformationMessage('Global Snippet path Not set, would you like to set it now?', 'Yes', 'No').then(value => {
        if (value === 'Yes') {
          window.showOpenDialog({ openLabel: 'Set Snippet Path', canSelectFiles: false, canSelectFolders: true }).then(res => {
            if (res) {
              workspace.getConfiguration().update('sass.snippets.path', res[0].fsPath.concat('/sass-snippets.json'), true);
              writeFileSync(res[0].fsPath.concat('/sass-snippets.json'), '{}');
              provider.Refresh(true);
            }
          });
        }
      });
    }
  }
  /**
   * Inserts data Into the given folder.
   *
   * Example path = [a, b, c], data will be added to c.[currentKey].children.
   *
   * **`Overwrites data with the same key.`**
   */
  private static _INSERT_DATA(path: string[], data: TreeData) {
    let level = 0;

    path.reduce((accumulator, currentKey) => {
      level++;
      if (level === path.length) {
        accumulator[currentKey].children = { ...accumulator[currentKey].children, ...data };
      } else {
        return accumulator[currentKey].children;
      }
    }, this._DATA);
  }

  private static _UPDATE_ITEM_POSITIONS(path: string[], itemToMove: { name: string; data: SassTreeItemDataRaw }, direction: 'up' | 'down') {
    let level = 0;
    let canChangePos = false;
    path.reduce((accumulator, currentKey) => {
      level++;
      if (level === path.length) {
        for (const key in accumulator[currentKey].children) {
          if (accumulator[currentKey].children.hasOwnProperty(key)) {
            const currentItemDataRef = accumulator[currentKey].children[key].data;
            if (!(key === itemToMove.name)) {
              if (direction === 'up' && itemToMove.data.position - 1 === currentItemDataRef.position) {
                canChangePos = true;
                accumulator[currentKey].children[key].data.position = currentItemDataRef.position + 1;
              } else if (direction === 'down' && itemToMove.data.position + 1 === currentItemDataRef.position) {
                canChangePos = true;
                accumulator[currentKey].children[key].data.position = currentItemDataRef.position - 1;
              }
            }
          }
        }
        if (canChangePos) {
          accumulator[currentKey].children[itemToMove.name].data.position =
            direction === 'up'
              ? accumulator[currentKey].children[itemToMove.name].data.position - 1
              : accumulator[currentKey].children[itemToMove.name].data.position + 1;
        }
        return accumulator;
      } else {
        return accumulator[currentKey].children;
      }
    }, this._DATA);
    return canChangePos;
  }

  private static _DELETE_DATA(path: string[]) {
    let level = 0;
    let deletedData: TreeData['any'] = undefined;
    path.reduce((lastReturnValue, currentKey) => {
      level++;
      if (level === path.length) {
        deletedData = lastReturnValue[currentKey];
        delete lastReturnValue[currentKey];
        return;
      } else {
        return lastReturnValue[currentKey].children;
      }
    }, this._DATA);
    return deletedData;
  }
  private static _WRITE_DATA_TO_FILES(single?: { location: FileLocation; baseName: string }) {
    if (single !== undefined) {
      writeFile(single.location.path, JSON.stringify(this._DATA[single.baseName].children), err => {
        throw err;
      });
    } else {
      for (const key in this._FILE_LOCATIONS) {
        if (this._FILE_LOCATIONS.hasOwnProperty(key)) {
          const location = this._FILE_LOCATIONS[key];
          writeFile(location.path, JSON.stringify(this._DATA[key].children), err => {
            throw err;
          });
        }
      }
    }
  }
  private static _DOES_PATH_EXIST(path: string[]) {
    let tempData: TreeData = null;
    let exists = true;
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (tempData === null) {
        if (this._DOES_KEY_EXIST(this._DATA, key)) {
          tempData = this._DATA[key].children;
        } else {
          exists = false;
          tempData = {};
          break;
        }
      } else {
        if (this._DOES_KEY_EXIST(tempData, key)) {
          tempData = tempData[key].children;
        } else {
          exists = false;
          tempData = {};
          break;
        }
      }
    }
    return { data: tempData, exists };
  }
  private static _DOES_KEY_EXIST(data: any, key: string) {
    if (data === undefined || data[key] === undefined) {
      return false;
    }
    return true;
  }
  private static _CREATE_PATH(key: string, path?: string[]): string[] {
    if (path !== undefined) {
      return path.concat(key);
    } else {
      return [key];
    }
  }
}
