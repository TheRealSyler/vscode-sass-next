'use strict';
import { TreeSnippetProvider, SnippetProviderUtility } from './tree/tree.provider';
import { TreeUtility } from './tree/tree.utility';
import { Abbreviations } from './abbreviations/abbreviations';
import { CompletionItemKind, ExtensionContext, commands, window, Position, Range, Disposable } from 'vscode';
import { PreviewServer } from './preview/preview';

export interface STATE {
  [name: string]: { item: STATEItem; type: 'Mixin' | 'Variable' };
}
export type STATEItem = { title: string; insert: string; detail: string; kind: CompletionItemKind };

export function activate(context: ExtensionContext) {
  const abbreviations = commands.registerCommand('sass.abbreviations', () => {
    if (window && window.activeTextEditor) {
      const start = new Position(window.activeTextEditor.selection.start.line, 0);
      const currentWord = window.activeTextEditor.document.getText(new Range(start, window.activeTextEditor.selection.active));
      Abbreviations(window.activeTextEditor.document, start, currentWord);
    }
  });
  let preview_server = null;
  const preview = commands.registerCommand('sass.preview', () => {
    console.log('PREVIEW');
    preview_server = new PreviewServer();
  });

  // Tree SECTION
  let TreeDisposables: Disposable[] = [];
  const TreeProvider = new TreeSnippetProvider(context);
  SnippetProviderUtility.setProvider(TreeProvider);
  TreeDisposables[0] = window.registerTreeDataProvider('snippets', TreeProvider);
  TreeDisposables[1] = commands.registerCommand('sass.tree.refreshEntry', () => {
    TreeProvider.refresh(true);
  });
  TreeDisposables[2] = commands.registerCommand('sass.tree.addFromSelection', item => {
    TreeUtility.addFromSelection(item);
  });
  TreeDisposables[3] = commands.registerCommand('sass.tree.delete', item => {
    TreeUtility.delete(item);
  });
  TreeDisposables[4] = commands.registerCommand('sass.tree.edit', item => {
    TreeUtility.edit(item);
  });
  TreeDisposables[5] = commands.registerCommand('sass.tree.moveUp', item => {
    TreeUtility.move(item, 'up');
  });
  TreeDisposables[6] = commands.registerCommand('sass.tree.moveDown', item => {
    TreeUtility.move(item, 'down');
  });
  TreeDisposables[7] = commands.registerCommand('sass.tree.copy', item => {
    TreeUtility.copy(item);
  });
  TreeDisposables[8] = commands.registerCommand('sass.tree.paste', item => {
    TreeUtility.paste(item);
    // TreeUtility.pasteFromClipboard();
  });
  TreeDisposables[9] = commands.registerCommand('sass.tree.addFolder', item => {
    TreeUtility.addFolder(item);
  });
  TreeDisposables[10] = commands.registerCommand('sass.tree.insert', item => {
    TreeUtility.insert(item);
  });
  TreeDisposables[11] = commands.registerCommand('sass.tree.insertFolder', item => {
    TreeUtility.insertFolder(item);
  });
  TreeDisposables[12] = commands.registerCommand('sass.tree.openFile', item => {
    TreeUtility.openFile(item);
  });
  TreeDisposables[13] = commands.registerCommand('sass.tree.cut', item => {
    TreeUtility.cut(item);
  });
  TreeDisposables[14] = commands.registerCommand('sass.tree.recalculatePosition', item => {
    TreeUtility.recalculatePosition(item);
  });
  TreeDisposables[15] = commands.registerCommand('sass.tree.addFromFile', item => {
    TreeUtility.addFromFile(item, 'both');
  });
  TreeDisposables[16] = commands.registerCommand('sass.tree.addFromFileMixins', item => {
    TreeUtility.addFromFile(item, 'mixin');
  });
  TreeDisposables[17] = commands.registerCommand('sass.tree.addFromFileVariables', item => {
    TreeUtility.addFromFile(item, 'var');
  });
  // - !SECTION

  context.subscriptions.push(...TreeDisposables);
  context.subscriptions.push(abbreviations);
  context.subscriptions.push(preview);
}

export function deactivate() {}
