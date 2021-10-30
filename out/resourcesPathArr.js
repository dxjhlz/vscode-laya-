"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourcesPathArr = void 0;
const fs = require("fs");
const path = require("path");
class resourcesPathArr {
    constructor(_path) {
        this.STR_SHARE = "share";
        this.STR_RES = "res";
        this.resourcesPath = _path;
        this.tempPath = [];
    }
    getImgPathArr() {
        let imgPath = this.getImgPath();
        this.imgFileDisplay(imgPath);
        return this.tempPath;
    }
    imgFileDisplay(filePath) {
        const files = fs.readdirSync(filePath);
        //console.log("files",files);
        for (let filename of files) {
            const filepath = path.join(filePath, filename);
            const stats = fs.statSync(filepath);
            const isFile = stats.isFile();
            const isDir = stats.isDirectory();
            if (isFile) {
                //console.log("filepath",filepath);
                this.tempPath.push(filepath);
            }
            if (isDir) {
                if (filename == this.STR_SHARE || filename == this.STR_RES) {
                    continue;
                }
                ;
                this.imgFileDisplay(filepath);
            }
        }
        // console.log("files",files);
    }
    getImgPath() {
        let filepathSplit = this.resourcesPath.split("\\");
        let filePath = this.getFilePath(filepathSplit);
        return filePath;
    }
    getFilePath(strArr) {
        let Path = "";
        for (let index = 0; index < strArr.length - 3; index++) {
            let element = strArr[index];
            Path += element + "/";
        }
        Path = Path + "bin" + "/h5";
        console.log("Path", Path);
        return Path;
    }
}
exports.resourcesPathArr = resourcesPathArr;
//# sourceMappingURL=resourcesPathArr.js.map