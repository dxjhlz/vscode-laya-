"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeConfig = void 0;
const fs = require("fs");
const path = require("path");
const imgPathArr_1 = require("./imgPathArr");
class changeConfig {
    constructor(_vscode) {
        this.tempPath = [];
        this.configJson = {};
        this.resources = [];
        this.d = {};
        this.filePath = [];
        this.vscode = _vscode;
        this.init();
    }
    init() {
        var vscode1 = this.vscode;
        var document = vscode1.window.activeTextEditor.document;
        // var position : Position = new Position(2,0);
        // var position2 : Position = new Position(3,0);
        // var range : Range = new Range(position,position2);
        //var content : string = document.getText(); 
        // let filepathSplit : string[] = document.fileName.split("\\"); 
        // let filePath : string = this.getFilePath(filepathSplit,3);
        // this. fileDisplay(filePath);
        // this.setConfigJson()//将config的json数据写入configJson
        let resPathArr = new imgPathArr_1.resourcesPathArr(this.vscode);
        // resPathArr.getContrastImgRelativePath().then(resArr=>{
        //     let jsonPath : fs.PathLike = document.fileName.replace(/\\\\/g,"/");
        //     this.tempPath = resArr;
        //     this.ergodictempPath();
        //     this.writeJson(this.configJson,jsonPath);
        //     this.vscode.window.showInformationMessage("你可以的！"+document.fileName);
        // },error=>{
        //     console.log(error);
        // });
        //console.log(this.tempPath)
    }
    // fileDisplay(filePath:string):void{
    //     const files = fs.readdirSync(filePath);
    //     //console.log("files",files);
    //     for(let filename of files){
    //         const filepath  = path.join(filePath,filename);
    //         const stats = fs.statSync(filepath);
    //         const isFile = stats.isFile();
    //         const isDir = stats.isDirectory();
    //         if(isFile){
    //             //console.log("filepath",filepath);
    //             this.tempPath.push(filepath);
    //         }
    //         if(isDir){
    //             this.fileDisplay(filepath);
    //         }
    //     }
    //    // console.log("files",files);
    // }
    ergodictempPath() {
        for (let item of this.tempPath) {
            let extname = path.extname(item);
            //console.log("filePath",item);
            //let basename : string = path.basename(item,extname);
            let type = this.GetType(extname);
            if (type == "null")
                continue;
            let item1;
            item1 = item;
            this.d.url = item1;
            this.d.type = type;
            this.configJson["pages"][1]["res"].push(this.d);
            // console.log("outjson.json",this.outjson);
            this.d = {};
        }
        console.log("configJson", this.configJson);
    }
    //写入json文件选项
    writeJson(data, jsonFilePath) {
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 4).replace(/\\\\/g, "/"), 'utf-8');
    }
    GetType(extension) {
        switch (extension) {
            case ".png":
            case ".jpg":
                return "image";
            case ".wav":
                return "sound";
            case ".sk":
                return "arraybuffer";
            default:
                return "null";
        }
    }
    getFilePath(strArr, num) {
        let Path = "";
        for (let index = 0; index < strArr.length - num; index++) {
            let element = strArr[index];
            Path += element + "/";
        }
        Path = Path + "bin";
        // console.log("Path",Path);
        return Path;
    }
    setConfigJson() {
        let document = this.vscode.window.activeTextEditor.document;
        let content = document.getText();
        this.configJson = JSON.parse(content);
        console.log("configJson", this.configJson);
    }
}
exports.changeConfig = changeConfig;
//# sourceMappingURL=changeConfig.js.map