"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordCount = void 0;
const vscode_1 = require("vscode");
class wordCount {
    // 构造函数
    constructor(_vscode) {
        this.disposable = new vscode_1.Disposable(() => {
            console.log("hahha");
        });
        this.vscode = _vscode;
        this.init();
    }
    init() {
        let vscode = this.vscode;
        let StatusBarAlignment = vscode.StatusBarAlignment;
        let window = this.vscode.window;
        //statusBar，是需要手动释放的
        this.statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
        //跟注册事件相配合的数组，事件的注册，也是需要释放的
        //事件在注册的时候，会自动填充一个回调的dispose到数组
        window.onDidChangeTextEditorSelection(this.updateText, this, this.disposable);
        //保存需要释放的资源
        // this.disposable = this.vscode.Disposable.from(this.disposable);
        this.updateText();
        this.statusBar.show();
    }
    updateText() {
        let window = this.vscode.window;
        this.editor = window.activeTextEditor;
        var content = this.editor.document.getText();
        // var len = content.replace(/[\r\n\s]+/g,'').length;
        var len = this.getNumberCount(content);
        this.statusBar.color = "orange";
        this.statusBar.accessibilityInformation = "hahaha";
        this.statusBar.text = `啦啦啦...已经敲了${len}个数字了，alignment:${this.statusBar.alignment}`;
        // if(len > 5){
        //     this.vscode.window.showInformationMessage("数字已超过5个，请检查！");
        // }
    }
    getNumberCount(content) {
        var patt1 = /[0-9]/g;
        var numArr = content.match(patt1);
        if (numArr) {
            return numArr.length;
        }
        else {
            return 0;
        }
        ;
    }
}
exports.wordCount = wordCount;
//# sourceMappingURL=wordCount.js.map