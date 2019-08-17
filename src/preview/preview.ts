import express = require('express');
import WebSocket = require('ws');
import chokidar = require('chokidar');
import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
// import { renderSync } from 'node-sass';
// import sass = require('node-sass');
import { renderSync } from 'sass';
import { isVar, isClassOrId, isMixin, escapeRegExp } from '../utility/utility.regex';
import { resolve } from 'path';
import { workspace, extensions } from 'vscode';

class PreviewServerMessage {
  constructor(public payload: any, public type: 'message' | 'setPreview' = 'message') {}
}

class PreviewData {
  constructor(public css: string, public sass: string, public selector: string) {}
}

export class PreviewServer {
  private _FILE: {
    text: string;
    changedContent: {
      variables: string;
      class: string;
    };
  } = {
    text: undefined,
    changedContent: {
      variables: undefined,
      class: undefined
    }
  };
  constructor(
    public path = 'C:\\Users\\Syler\\Google Drive\\Code Stuff\\tests\\test.sass',
    public selector = 'class',
    public app = express(),
    public port = 3000,
    public socketServer = new WebSocket.Server({
      port: port + 10
    })
  ) {
    console.log('DIR', resolve(extensions.getExtension('syler.sass-next').extensionPath, './dist/public/index.html'));
    // extensions.getExtension('syler.sass-next')
    // serve static
    // app.use(express.static('src/preview/public'));
    app.get('/', (req, res) => {
      res.sendFile(resolve(extensions.getExtension('syler.sass-next').extensionPath, './dist/public/index.html'));
    });
    app.get('/index.css', (req, res) => {
      res.sendFile(resolve(extensions.getExtension('syler.sass-next').extensionPath, './dist/public/index.css'));
    });
    app.get('/index.js', (req, res) => {
      res.sendFile(resolve(extensions.getExtension('syler.sass-next').extensionPath, './dist/public/index.js'));
    });
    app.get('/favicon.png', (req, res) => {
      res.sendFile(resolve(extensions.getExtension('syler.sass-next').extensionPath, './dist/public/favicon.png'));
    });
    app.use(express.json());
    app.post('/compileSass', (req, res) => {
      const data = this.compile(req.body.sass, false);
      if (data.css !== undefined) {
        res.send({ css: data.css, msg: '[compileSass]: successfully compiled' });
      } else if (data.err !== undefined) {
        res.status(400).send({ css: undefined, msg: '[compileSass]:'.concat(data.err) });
      } else {
        res.status(500).send({ css: undefined, msg: '[compileSass]: Unknown Error' });
      }
    });
    app.post('/writeToFile', (req, res) => {
      if (this._FILE.text && req.body) {
        writeFileSync(path, this.insertIntoFile(req.body.sass));
        this.broadcast(new PreviewServerMessage(`Writing to: ${path} at: ${new Date().toLocaleString()}`));
        res.send({ css: undefined, msg: '[writeToFile]: Success ' });
      } else {
        res.status(500).send({ css: undefined, msg: '[writeToFile]: Unknown Error' });
      }
    });
    app.get('/setPreview', (req, res) => {
      const file = this.filterRawFile(readFileSync(path).toString());
      this.broadcast(new PreviewServerMessage(`Loading: ${path} at: ${new Date().toLocaleString()}`));
      this.compile(file);
      res.send({ msg: '[setPreview]: success' });
    });

    app.listen(port, () => {
      console.log(chalk.yellow('[Express]'), 'Listening... ', port, new Date().toLocaleString());
    });

    socketServer.on('connection', ws => {
      console.log(chalk.magenta('[Websocket]'), 'Connected');
    });
    chokidar.watch(path).on('all', (event, _path) => {
      console.log(chalk.blueBright.bold('[chokidar]'), event, _path);
      this.broadcast(new PreviewServerMessage(`${event}: ${_path} at: ${new Date().toLocaleString()}`));
      const file = this.filterRawFile(readFileSync(_path).toString());
      this.compile(file);
    });
  }

  broadcast(data: PreviewServerMessage) {
    this.socketServer.clients.forEach(ws => {
      ws.send(JSON.stringify(data));
    });
  }

  private compile(data: string, broadcastSuccess = true) {
    try {
      const result = renderSync({
        data: data,
        indentedSyntax: true
      });
      const css = result.css.toString();
      if (css) {
        if (broadcastSuccess) {
          this.broadcast(new PreviewServerMessage(new PreviewData(css, data, this.selector), 'setPreview'));
        }

        return { css, err: undefined };
      }
    } catch (err) {
      this.broadcast(new PreviewServerMessage(`ERROR ${err}`));
      return { css: undefined, err };
    }
    return { css: undefined, err: undefined };
  }

  private filterRawFile(file: string): string {
    const lines = file.split('\n');
    let variables = '';
    let content = '._sass_preview_class\n';
    let add = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (isVar(line)) {
        variables = variables.concat(line, '\n');
      } else if (new RegExp('^ *'.concat(`\\.${this.selector}`)).test(line)) {
        add = true;
      } else if (add) {
        if (!isClassOrId(line) && !isMixin(line)) {
          content = content.concat(line, '\n');
        } else {
          add = false;
        }
      }
    }

    this._FILE.text = file;
    this._FILE.changedContent.variables = variables;
    this._FILE.changedContent.class = content.replace('_sass_preview_class', this.selector);
    return variables.concat(content);
  }
  /**
   * adds the changed content to the file and returns it.
   */
  private insertIntoFile(content: string) {
    const varKeys = this._FILE.changedContent.variables.replace(/( *\$.*:).*/gm, '$1').split(/\r?\n/);
    const split = content.split('._sass_preview_class');
    const variables = split[0].split(/\r?\n/);
    const classContent = split[1];
    let newFile = '';
    const lines = this._FILE.text.split(/\r?\n/);
    let add = true;
    let skip = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      skip = false;
      if (isVar(line)) {
        for (let j = 0; j < varKeys.length; j++) {
          const key = varKeys[j];
          const reg = new RegExp(escapeRegExp(key));
          if (key && reg.test(line)) {
            newFile = newFile.concat(variables.find(value => reg.test(value)), '\n');
            skip = true;
          }
        }
      }
      if (new RegExp('^ *'.concat(`\\.${this.selector}`)).test(line)) {
        add = false;
        newFile = newFile.concat(`\.${this.selector}`, classContent);
      } else if (isClassOrId(line) || isMixin(line)) {
        add = true;
      }
      if (add === true && !skip) {
        newFile = newFile.concat('\n', line);
      }
    }
    return newFile;
  }
}

// const test = new PreviewServer();
