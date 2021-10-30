"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalUri = exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const changeConfig_1 = require("./changeConfig");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "extension1" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension1.whatishuang', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        const message = "究竟周晃是什么垃圾，猪都不吃的东西";
        vscode.window.showInformationMessage(message);
    });
    context.subscriptions.push(disposable);
    let disposable2 = vscode.commands.registerCommand('extension1.helloDxj', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        const message2 = "别人笑我太疯癫，我笑周晃是垃圾";
        // getLocalUri();
        vscode.window.showInformationMessage(message2);
        // var wC : wordCount = new wordCount(vscode);
    });
    let disposableSetConfig = vscode.commands.registerCommand('extension1.setConfig', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // const message2 = "aaa";
        // getLocalUri();
        // vscode.window.showInformationMessage(message2);
        var setConfig = new changeConfig_1.changeConfig(vscode);
    });
    // context.subscriptions.push(disposable2);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
function getLocalUri() {
    const good = vscode.Uri.file('.././extension.ts');
    // var workDir = vscode.workspace.getWorkspaceFolder(good);
    console.log("aaa");
    // const workDir  = path.dirname("src");
}
exports.getLocalUri = getLocalUri;
//# sourceMappingURL=extension.js.map