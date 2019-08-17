[![](https://vsmarketplacebadge.apphb.com/version-short/syler.sass-indented.svg)](https://marketplace.visualstudio.com/items?itemName=syler.sass-indented)
[![](https://vsmarketplacebadge.apphb.com/installs-short/syler.sass-indented.svg)](https://marketplace.visualstudio.com/items?itemName=syler.sass-indented)
[![GitHub stars](https://img.shields.io/github/stars/TheRealSyler/vscode-sass-indented.svg?style=social&label=Star%20on%20Github)](https://github.com/TheRealSyler/vscode-sass-indented)
[![GitHub issues](https://img.shields.io/github/issues-raw/TheRealSyler/vscode-sass-indented?color=%232a2)](https://github.com/TheRealSyler/vscode-sass-indented)
[![Maintenance](https://img.shields.io/maintenance/yes/2019.svg)](https://GitHub.com/TheRealSyler/vscode-sass-indented/graphs/commit-activity)
<!-- [![](https://vsmarketplacebadge.apphb.com/rating-short/syler.sass-indented.svg)](https://marketplace.visualstudio.com/items?itemName=syler.sass-indented) -->
# *Indented Sass syntax highlighting, autocomplete & Formatter for VSCode*

## ***Installing***
Search for Sass from the extension installer within VSCode or put this into the command palette.
```cmd
ext install sass-indented
```

## **Features**
___
> Syntax Highlighting

> AutoCompletions

> Formatter

> Abbreviations and Sass Snippets, are experiments, i might remove them.

### 1.6.2 New Additions
* the formatter now sets the space between a property and its value.

>Note: The snippets have been removed if you still want to use them, you can get them [here](https://github.com/TheRealSyler/vscode-sass-indented/blob/a3ffc7a005c2ccd82e7c50ccf391ba5d22afee13/snippets/sass.json).

### **Formatter**
___
There are two special character sequences that give commands to the formatter.
1. `///S` The formatter ignores empty lines until the next class, id or mixin.
2. `///R` The formatter uses the beginning of the command as the current indentation level.

Options can be set in the [Configuration](#Configuration)

![Formatter Example](https://media.giphy.com/media/fXhWNUfxr2bFNqgHzk/giphy.gif)

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

Configuration options can be set in the `Sass (Indented)` section of VSCode settings or by editing your `settings.json` directly.

### General
| Option                       | Type    | Default                                      | Description                                                                                               |
| ---------------------------- | ------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `sass.disableAutoIndent`     | boolean | false                                        | Stop the extension from automatically indenting when pressing Enter                                       |
| `sass.disableUnitCompletion` | boolean | true                                         | adds units to the intellisense completions if false.                                                      |
| `sass.snippets.path`         | string  | `"none"`                                     | path for the global snippets file.                                                                        |
| `sass.andStared`             | array   | `["active", "focus",  "hover", "nth-child"]` | items in this array will be at the top of the completion list (only for items that show after the & sign) |

### Formatter
| Option                         | Type    | Default | Description                                                    |
| ------------------------------ | ------- | ------- | -------------------------------------------------------------- |
| `sass.format.enabled`          | boolean | true    | enables the sass formatter.                                    |
| `sass.format.deleteWhitespace` | boolean | true    | removes trailing whitespace.                                   |
| `sass.format.deleteEmptyRows`  | boolean | true    | removes empty rows.                                            |
| `sass.format.deleteCompact`    | boolean | true    | removes empty rows that are near a property.                   |
| `sass.format.setPropertySpace` | boolean | true    | If true space between the property: value, is always set to 1. |


## **Bugs**
___
If you encounter any bugs please [open a new issue](https://github.com/TheRealSyler/vscode-sass-indented/issues/new?assignees=TheRealSyler&labels=bug&template=bug_report.md&title=).

## **Contributing**

>Note: [next](https://github.com/TheRealSyler/vscode-sass-indented/tree/next) is the experimental/newest branch, [master](https://github.com/TheRealSyler/vscode-sass-indented) should be stable.

The source for this extension is available on [github](https://github.com/TheRealSyler/vscode-sass-indented). If anyone feels that there is something missing or would like to suggest improvements please [open a new issue](https://github.com/TheRealSyler/vscode-sass-indented/issues/new?assignees=TheRealSyler&labels=enhancement&template=feature_request.md&title=) or send a pull request! Instructions for running/debugging extensions locally [here](https://code.visualstudio.com/docs/extensions/overview).

## **Credits**

- Thanks to [@robinbentley](https://github.com/robinbentley) for creating and maintaining the project until version 1.5.1.
- Property/Value Autocompletion - [Stanislav Sysoev (@d4rkr00t)](https://github.com/d4rkr00t) for his work on [language-stylus](https://github.com/d4rkr00t/language-stylus) extension
- Syntax highlighting - [https://github.com/P233/Syntax-highlighting-for-Sass](https://github.com/P233/Syntax-highlighting-for-Sass)
- Sass seal logo - [http://sass-lang.com/styleguide/brand](http://sass-lang.com/styleguide/brand)

## Changelog
The full changelog is available here: [changelog](CHANGELOG.md).

## License
[MIT - https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)