"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soundResources = exports.imgResources = void 0;
const fs = require("fs");
const path = require("path");
class imgResources {
    constructor(_path) {
        this.resourcesPath = _path;
        this.tempPath = [];
    }
    fileDisplay(filePath) {
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
                this.fileDisplay(filepath);
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
        Path = Path + "bin";
        console.log("Path", Path);
        return Path;
    }
}
exports.imgResources = imgResources;
class soundResources {
    constructor(_path) {
        this.resourcesPath = _path;
        this.tempPath = [];
    }
    fileDisplay(filePath) {
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
                this.fileDisplay(filepath);
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
        Path = Path + "bin";
        console.log("Path", Path);
        return Path;
    }
}
exports.soundResources = soundResources;
//# sourceMappingURL=imgResources.js.map