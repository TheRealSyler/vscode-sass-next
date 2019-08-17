import { TreeItem, TreeItemCollapsibleState, Command } from 'vscode';
import { join } from 'path';
export type SassTreeItemType = 'folder' | 'snippet' | 'root';
export class SassTreeItemData {
  constructor(public insert: string, public type: SassTreeItemType, public path: string[], public position: number, public desc?: string) {}
}

export class SassTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly data: SassTreeItemData,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command
  ) {
    super(label, collapsibleState);
  }

  get tooltip(): string {
    return this.data.desc === undefined ? this.label : this.data.desc;
  }

  get description(): string {
    return this.data.desc;
  }

  get iconPath() {
    switch (this.data.type) {
      case 'root':
      case 'folder':
        return {
          light: join(__filename, '..', '..', '..', 'resources', 'light', 'folder.svg'),
          dark: join(__filename, '..', '..', '..', 'resources', 'dark', 'folder.svg')
        };

      case 'snippet':
        if (this.label.startsWith('@')) {
          return {
            light: join(__filename, '..', '..', '..', 'resources', 'light', 'method.svg'),
            dark: join(__filename, '..', '..', '..', 'resources', 'dark', 'method.svg')
          };
        } else if (this.label.startsWith('$')) {
          return {
            light: join(__filename, '..', '..', '..', 'resources', 'light', 'variable.svg'),
            dark: join(__filename, '..', '..', '..', 'resources', 'dark', 'variable.svg')
          };
        } else {
          return {
            light: join(__filename, '..', '..', '..', 'resources', 'light', 'snippet.svg'),
            dark: join(__filename, '..', '..', '..', 'resources', 'dark', 'snippet.svg')
          };
        }
    }
  }

  get contextValue(): string {
    return this.data.type;
  }
}
