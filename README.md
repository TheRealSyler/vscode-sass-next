[![](https://vsmarketplacebadge.apphb.com/version-short/syler.sass-next.svg)](https://marketplace.visualstudio.com/items?itemName=syler.sass-next)
[![](https://vsmarketplacebadge.apphb.com/installs-short/syler.sass-next.svg)](https://marketplace.visualstudio.com/items?itemName=syler.sass-next)
[![GitHub issues](https://img.shields.io/github/issues-raw/TheRealSyler/vscode-sass-next?color=%232a2)](https://github.com/TheRealSyler/vscode-sass-next)
[![Maintenance](https://img.shields.io/maintenance/yes/2019.svg)](https://GitHub.com/TheRealSyler/vscode-sass-next/graphs/commit-activity)
<!-- [![GitHub stars](https://img.shields.io/github/stars/TheRealSyler/vscode-sass-next.svg?style=social&label=Star%20on%20Github)](https://github.com/TheRealSyler/vscode-sass-next) -->
<!-- [![](https://vsmarketplacebadge.apphb.com/rating-short/syler.sass-next.svg)](https://marketplace.visualstudio.com/items?itemName=syler.sass-next) -->
# *Sass Next*

## ***Installing***
Search for Sass from the extension installer within VSCode or put this into the command palette.
```cmd
ext install sass-next
```

## **Features**
___

> Sass Snippets

> Abbreviations

### **Abbreviations**
___
When you type `?` a input box will show up, by typing something like `.class,m,p` and hitting enter a new snippet will be inserted, with this input the created snippet looks like this:

```sass
.class
  margin: $1
  padding: $2
$0
```

the `$*` sign is where the cursor will be placed, after using this for a bit i must admit that this is not really that useful, but if you type `!` in the input box then the extension will search for a html file with the same name in the same directory and will add all the classes and ids to the file for you which i find to be really helpful, if you are in an angular project use `"` instead in addition to adding all the classes and ids from the html file it also imports the styles.sass file, if it exists.

![Abbreviations Example](https://media.giphy.com/media/Y0mU4xUqiXcWto2znK/giphy.gif)

### **Sass Snippets**
___

>Note: you should also save the snippets in a different file, just to be sure that they don't get lost, some times i still get some weird behavior.

#### ***File Structure***

The snippets are saved in json files, you can add a local root folder in a workspace folder by creating a `sass.snippets.json` file in the .vscode folder.
You can open a root folders `sass.snippets.json` file by right clicking and choosing `Open File`.

```json
{
  "folder or snippet": {
    "children": {},
    "data": { "type": "folder", "position": 0 }
  }
}
```

In the `children` property you can add the same thing as many times as you want, all the fields in the example above are required, the `position` property is used to sort the item in a folder, in theory, doesn't work perfectly at the moment, the `type` property can be `folder` or `snippet`, the `data` property can have `type | position | insert | desc | isOpen` as sub properties, `insert` is the text that will be inserted, remember to escape the `$` signs with a `\`, `desc` is the description, `isOpen` determines weather the a folder is open or closed when loading the file for the first time,note that the property doesn't change when opening or closing a folder.

#### ***Snippets***

Snippets work like vscode snippets, but there is a slight difference, instead of using `$anyNumber`, use `$N` for tab stops when inserting the `N` gets replace by the correct number.

**Examples:**
| Default Snippet | Sass Snippet |
| --------------- | ------------ |
| `$[0-9]`        | `$N`         |
| `${[0-9]:abc}`  | `${N:abc}`   |

There is a slight downside to this which is that you can't have something like `$0a$2b$1`, at least if you use insert folder, if you only insert snippets individually then the normal vscode snippet tab stops work just fine.

![Snippets Example](https://media.giphy.com/media/YOqB0YA8EscojipKmi/giphy.gif)

## **Configuration**
___

Configuration options can be set in the `Sass Next` section of VSCode settings or by editing your `settings.json` directly.

### General
| Option               | Type   | Default  | Description                        |
| -------------------- | ------ | -------- | ---------------------------------- |
| `sass.snippets.path` | string | `"none"` | path for the global snippets file. |

## **Bugs**
___
If you encounter any bugs please [open a new issue](https://github.com/TheRealSyler/vscode-sass-next/issues/new?assignees=TheRealSyler&labels=bug&template=bug_report.md&title=).

## **Contributing**

The source for this extension is available on [github](https://github.com/TheRealSyler/vscode-sass-next). If anyone feels that there is something missing or would like to suggest improvements please [open a new issue](https://github.com/TheRealSyler/vscode-sass-next/issues/new?assignees=TheRealSyler&labels=enhancement&template=feature_request.md&title=) or send a pull request! Instructions for running/debugging extensions locally [here](https://code.visualstudio.com/docs/extensions/overview).

## **Credits**
- Sass seal logo - [http://sass-lang.com/styleguide/brand](http://sass-lang.com/styleguide/brand)

## Changelog
The full changelog is available here: [changelog](CHANGELOG.md).

## License
[MIT - https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)