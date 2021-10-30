

import * as fs from 'fs';
import * as path from 'path';
import { TextDocument } from 'vscode';

export class resourcesPathArr{
    configJson : any = {};//config配置
    _vscode : any;        //vscode
    d : any = {};         //需要配置的资源单个写入到这里

    pathArr : string[] = [];
    resourcesPath : string;
    filepathSplit : string[];
    tempPath : string[];
    UIpath : string[] = [];  //UI路径
    // UIName : string[] = [];  //导入的as文件的ui的文件名
    soundRes : string[] = [];
    STR_SHARE:string = "share";
    STR_RES:string = "res";
    arrUIChild:any = [];  //遍历page的ui类的所有对象
    constructor(vscode:any){
        this._vscode = vscode;
        var document : TextDocument = this._vscode.window.activeTextEditor.document;
        this.resourcesPath = document.fileName;
        this.filepathSplit = this.resourcesPath.split("\\"); 
        this.tempPath = [];
        this.soundRes = [];
        this.setConfigJson()//将config的json数据写入configJson
        this.getUIfile();
        // var citations : number[] = [0,1,0,3,12];
        // console.log("this.moveZeroes(citations);",this.moveZeroes(citations));
        
        // console.log("findShortestSubArray", this.findShortestSubArray(nums));
        
        //this.setConfigRes();
        // this.getdirSound();
        // this.judgeImportSound("111");
    }
    // moveZeroes(nums:number[]) {
    //     let count = 0;
    //     while(nums.indexOf(0)!=-1){
    //         let idx = nums.indexOf(0)
    //         nums.splice(idx,1);
    //         count++;
    //     }
    //     for (let j = 0; j < count; j++) {
    //         nums.push(0);
    //     }
    //     return nums;
    // };
    /******************************************** */
    /************将config的json数据赋值configJson************ */
    setConfigJson():void{
        let document : TextDocument = this._vscode.window.activeTextEditor.document;
        let content : string = document.getText(); 
        this.configJson = JSON.parse(content);
        // console.log("configJson",this.configJson);
    }
    ergodictempPath(resArr: string[],viewidx:number):void{
        for (let item of resArr) {
            let extname : string = path.extname(item);
            //console.log("filePath",item);
            //let basename : string = path.basename(item,extname);
            let type : string = this.GetType(extname);
            if (type == "null")
            continue;
            if(this.isContain(viewidx,item)){
                let item1 : fs.PathLike;
                item1 = item;
                this.d.url = item1;
                if(type != "atlas"){
                    this.d.type = type;
                }
                this.configJson["pages"][viewidx]["res"].push(this.d);
                this.d = {}
            }
          //console.log("outjson.json",this.outjson); 
        }
        console.log("over");
        
        // console.log("configJson",this.configJson);
    }
    /************判断需要添加的资源是否已经在配置中************ */
    isContain(viewidx:number,configUrl:fs.PathLike):boolean{
        var resArr : any =  this.configJson["pages"][viewidx]["res"];
        for (let i = 0; i < resArr.length; i++) {
            const resObj = resArr[i];
            if(resObj.url == configUrl){
                return false
            }
        }
        return true;
    }
    /**********************写入json文件选项**************** */
    writeJson(data: any, jsonFilePath: string) {
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2).replace(/\\\\/g, "/"), 'utf-8');
    }
    GetType(extension: string): string {
        switch (extension) {
            case ".png":
            case ".jpg":
                return "image";
            case ".wav":
            case ".ogg":
            case ".mp3":
                return "sound";
            case ".sk":
                return "arraybuffer";
            case ".atlas":
                return "atlas";
            default:
                return "null";
        }
    }
     /******************************************** */
    /****************获取图片资源***************** */
    setConfigRes(viewidx:number,viewArr : string[]):void{
        // let getResolveArr : any = await 
        this.getContrastImgRelativePath(viewidx,viewArr).then(getResolveArr=>{
            if(!getResolveArr || getResolveArr.length<2){
                return
            }
            let configRes :string[] = getResolveArr[0]; //resolveArr[0] = arrImgRes
            let viewidx :number = getResolveArr[1];
            //this.setSoundRes();
            this.ergodictempPath(configRes,viewidx);
            // if(viewidx == this.configJson.pages.length-1){
            var document : TextDocument = this._vscode.window.activeTextEditor.document;
            this.resourcesPath = document.fileName;
            let jsonPath : fs.PathLike = document.fileName.replace(/\\\\/g,"/");
            this.writeJson(this.configJson,jsonPath);
            // }
            },err=>{
                console.log(err);
            }
        );
    }
    /*****************配置声音文件的相关资源***************** */
    async setSoundResArr(configResArr : string[],viewArr:string[]):Promise<any>{
        let soundArr = await this.getSoundRes(viewArr);
        for (let index = 0; index < soundArr.length; index++) {
            const soundPath = soundArr[index];
            configResArr.push(soundPath);
        }
        return new Promise(function(resolve,reject){
            resolve(configResArr);
        });
    }
    /*****************配置sk文件的相关资源***************** */
    setAniRes(configResArr : string[],res :string):string[]{
        let aniRes : string[] = []; 
        let replaceDir : string =  this.getFilePath(this.filepathSplit,2,"/assets/");
        // for (let i = 0; i < configResArr.length; i++) {
            // let res = configResArr[i];
            let extname : string = path.extname(res);
            if(extname == ".sk"){
                let basename : string = path.basename(res,extname);
                res = res.replace(basename+extname,"");
                let skDir : string =  this.getFilePath(this.filepathSplit,2,"/assets/"+res);
                aniRes = this.aniFileDisplay(skDir,aniRes,basename);
                for (let j = 0; j < aniRes.length; j++) {
                    let aniResUrl :string = aniRes[j];
                    aniResUrl = aniResUrl.replace(/\\/g, "/")
                    aniResUrl = aniResUrl.replace(replaceDir,"");
                    if(!configResArr.includes(aniResUrl)){
                        configResArr.push(aniResUrl);
                    }
                }
                // console.log("aniRes",aniRes);
            }
        return configResArr;
    }
    /**********************pageui类的skin相对路径的对比bin发布需要打包的图片资源*********************** */
    async getContrastImgRelativePath(viewidx:number,viewArr:string[]):Promise<any>{
        let configRes : string[] = [];
        let getResolveArr : any = await this.getPageUISkinRelativePath(viewidx,viewArr);//resolve要以数组的形式传递多个参数
        let arrImgRes :string = getResolveArr[0]; //resolveArr[0] = arrImgRes
       // let viewidx :number = getResolveArr[1];   //resolveArr[1] = config.pages里面数组的idx
        let releaseImgRes :string[] =  this.getRelativepath(3,"/bin/h5/","h5");
        if(!arrImgRes || !releaseImgRes || !arrImgRes.length || !releaseImgRes.length) {
            this._vscode.window.showInformationMessage("找不到bin文件资源");
            return}
        for (let index = 0; index < arrImgRes.length; index++) {
            const uiImgRes = arrImgRes[index];
            if(releaseImgRes.includes(uiImgRes)){
                configRes.push(uiImgRes);
            }else{
                var resAltas : string = this.getAltas(uiImgRes);
                if(resAltas && !configRes.includes(resAltas)){
                    configRes.push(resAltas);
                }
            }
        }
        configRes = await this.setSoundResArr(configRes,viewArr);
        // console.log("configImgRes",configRes);
        let setResolveArr : any = []; //resolve要以数组的形式传递多个参数
        setResolveArr.push(configRes,viewidx);
        return new Promise(function(resolve,reject){
            if(!configRes.length){
                reject();
            }else{
                resolve(setResolveArr);
            }
         })
    }

    getAltas(uiImgRes :string):string{
        try{
            var  resAltas :string = "";
            let filePath : string = this.getFilePath(this.filepathSplit,3,"/bin/h5/res/atlas/");
            var splituiImgRes : string[] = uiImgRes.split("/");
            let relatAltas : string = this.getFilePath(splituiImgRes,1);
            resAltas = filePath + relatAltas+".atlas";
            const stats = fs.statSync(resAltas);
            if(stats){
                resAltas = "res/atlas/"+ relatAltas +".atlas"
                return resAltas
            }else{
                return "";

            }
        }
        catch(err){
            return "";

        }
    }
    /****************获取UI用到的图片资源***************最终的page的ui类配置的skin相对路径** */
    async getPageUISkinRelativePath(viewidx:number,viewArr:string[]):Promise<any>{ 
        // let viewidx : number = await this.getAsfIle();
        // console.log("111111",this.UIName,viewidx);
        let UIFile : string[] = [];
        let UIName : string[] = [];
        let __dirGameUIPath : string = this.getFilePath(this.filepathSplit,2,"/pages");
        UIName = await this.setImportUi(viewArr);
        UIFile  = this.gameUiFileDisplay(__dirGameUIPath,UIName,UIFile);
        console.log("UIFile",UIFile);
        // console.log("UIFile",UIFile);
        let arrImgRes : string[] = [];  //ui类的skin的相对路径
        for (let index = 0; index < UIFile.length; index++) {
            const pagesUiPath = UIFile[index];
            try{
               
                let data : string = await this.readFileFunc(pagesUiPath);
                let uiJson :any =  JSON.parse(data);
                this.getPageuiRes(uiJson,arrImgRes); ////////疑问
                // console.log("uiJson",uiJson,pagesUiPath);
            }catch(err){
                console.log(err);
            }
        }
        let resolveArr : any = []; //resolve要以数组的形式传递多个参数
        resolveArr.push(arrImgRes,viewidx);
        // console.log("arrImgRes",arrImgRes);
        return new Promise(function(resolve,reject){
            if(!arrImgRes.length){
                reject();
            }else{
                resolve(resolveArr);
            }
         })
        // console.log("UIFile",UIFile);
    }
    /****************遍历pages的子节点然后拿资源**************** */
    getPageuiRes(uiJson : any,arr:string[]):any{
        if(!uiJson){
            return arr;
        }
        // if(uiJson.child.length){
        //     for (let index = 0; index < uiJson.child.length; index++) {
        //         this.getPageuiRes(uiJson.child[index],arr)
        //         //console.log("element",element);
        //     }
        // }else{
            this.arrUIChild = [];
            this.getUiChild(uiJson,this.arrUIChild);
            if(this.arrUIChild && this.arrUIChild.length){
                for (let index = 0; index < this.arrUIChild.length; index++) {
                    let childObj = this.arrUIChild[index];
                    if(childObj.props.skin && arr.indexOf(childObj.props.skin)==-1){
                        arr.push(childObj.props.skin);
                    }
                    if(childObj.type == "SkeletonPlayer" && childObj.props.url && arr.indexOf(childObj.props.url)==-1){
                        arr.push(childObj.props.url);
                        arr = this.setAniRes(arr,childObj.props.url);
                    }
                    if(childObj.type == "KlInputImage" && childObj.props.fontClipSkin && arr.indexOf(childObj.props.fontClipSkin)==-1){
                        arr.push(childObj.props.fontClipSkin);
                        // console.log("------------->>>>>>>>",childObj.props.fontClipSkin);
                    }
                }
            }
        // }
    }
    /****************获取ui类的所有对象节点******************* */
    getUiChild(uiJson : any,arr :any):any{
        if(uiJson.child.length){
            for (let index = 0; index < uiJson.child.length; index++) {
                arr.push(uiJson.child[index]);
                this.getUiChild(uiJson.child[index],arr);
                //console.log("element",element);
            }
        }
    }
    /****************将需要配置的资源push数组******************* */
    gameUiFileDisplay(filePath:string,UIName : string[],arr:string[]):string[]{
        //let UIName : string[] = await this.setImportUi(viewArr);////////////////////////////////////////////////////////这里zheli
        const files = fs.readdirSync(filePath);
        //console.log("files",files);
        for(let filename of files){
            const filepath  = path.join(filePath,filename);
            const stats = fs.statSync(filepath);
            const isFile = stats.isFile();
            const isDir = stats.isDirectory();
            if(isFile){
                let basename : string = path.basename(filename,".ui");
                //console.log("filepath",filepath);
                if(UIName.indexOf(basename)!=-1){
                    arr.push(filepath);
                }
                
            }
            if(isDir){
                if(filename == this.STR_SHARE || filename == this.STR_RES){
                    continue
                };

                this.gameUiFileDisplay(filepath,UIName,arr);
            }
        }
        return arr;
        
       // console.log("files",files);
    }
/*******************promise读取文档******************* */
    readFileFunc(filePath:string):Promise<any>{
        return new Promise(function(resolve,reject){
            fs.readFile(filePath,"utf8",function(err,data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            })
        })
    }
//     /****************获取as文件配置的声效***************** */
//    async getSoundRes(i:number):Promise<any>{
//         let viewArr: string[] = this.getAsfIle(i);
//         let soundRes: string[] = [];
//         for (let j = 0; j < viewArr.length; j++) {
//             let Aspath  = viewArr[j];
//             try{
//                 let data : string = await this.readFileFunc(Aspath);
//                 if(data){
//                     // this.judgeImportSound(data);
//                     if(j == viewArr.length-1){
                        
//                     }
//                 }else{
//                     console.log("data");
//                 }
//             }
//             catch(err){
//                 console.log("err",err);
//             }
//         }
//         return viewArr;
// }
/****************获取as文件***************** */
   getAsfIle(i:number):string[]{
        let viewArr: string[] = [];
        // let cfgjsonStr : string = fs.readFileSync(this.resourcesPath, "utf8");
        // let cfgjson : any = JSON.parse(cfgjsonStr);
        let cfgjson :any = this.configJson; 
        let pathSplit : string[] = [];  //装view.xxx.xxx的分割
        let subviewsViewPath : string = "";//as文件路径 拼接
        let GameAspath : string = "";  //as文件路径
                //遍历config的pages数组的对象
        let cfgview = cfgjson.pages[i];
        let __dirGameAsPath : string = this.getFilePath(this.filepathSplit,3,"/src/");
        // let cfgview : any = cfgjson.pages[1].subviews;
        // console.log("GameAsPath",__dirGameAsPath);
        if(cfgview.subviews){
            viewArr = [];
            for (let index = 0; index < cfgview.subviews.length; index++) {
                const ViewsJson = cfgview.subviews[index];
                pathSplit = ViewsJson.view.split(".");
                subviewsViewPath = this.getFilePath(pathSplit,1,"/");
                GameAspath  = __dirGameAsPath+subviewsViewPath+pathSplit[pathSplit.length-1]+".as";
                viewArr.push(GameAspath);
            }
        }else if(cfgview.view){
            viewArr = [];
            pathSplit  = cfgview.view.split(".");
            subviewsViewPath = this.getFilePath(pathSplit,1,"/");
            GameAspath  = __dirGameAsPath+subviewsViewPath+pathSplit[pathSplit.length-1]+".as";
            viewArr.push(GameAspath);
        }
        
        return viewArr;
}
/****************获取as匹配的UI文件***************** */
    async getUIfile():Promise<any>{
        let viewArr: string[] = [];
        // let cfgjsonStr : string = fs.readFileSync(this.resourcesPath, "utf8");
        // let cfgjson : any = JSON.parse(cfgjsonStr);
        let cfgjson :any = this.configJson; 
        let pathSplit : string[] = [];  //装view.xxx.xxx的分割
        let subviewsViewPath : string = "";//as文件路径 拼接
        let GameAspath : string = "";  //as文件路径
        for (let i = 0; i < cfgjson.pages.length; i++) {          //遍历config的pages数组的对象
            let cfgview = cfgjson.pages[i];
            let __dirGameAsPath : string = this.getFilePath(this.filepathSplit,3,"/src/");
            // let cfgview : any = cfgjson.pages[1].subviews;
            // console.log("GameAsPath",__dirGameAsPath);
            if(cfgview.subviews){
                viewArr = [];
                for (let index = 0; index < cfgview.subviews.length; index++) {
                    const ViewsJson = cfgview.subviews[index];
                    pathSplit = ViewsJson.view.split(".");
                    subviewsViewPath = this.getFilePath(pathSplit,1,"/");
                    GameAspath  = __dirGameAsPath+subviewsViewPath+pathSplit[pathSplit.length-1]+".as";
                    viewArr.push(GameAspath);
                }
            }else if(cfgview.view){
                viewArr = [];
                pathSplit  = cfgview.view.split(".");
                subviewsViewPath = this.getFilePath(pathSplit,1,"/");
                GameAspath  = __dirGameAsPath+subviewsViewPath+pathSplit[pathSplit.length-1]+".as";
                viewArr.push(GameAspath);
            }
            if(!viewArr.length) continue;
            this.setConfigRes(i,viewArr);
            // for (let j = 0; j < viewArr.length; j++) {
            //     let Aspath  = viewArr[j];
            //     try{
            //         let data : string = await this.readFileFunc(Aspath);
            //         if(data){
            //             this.judgeImportUI(data);
            //             this.judgeImportSound(data);
                        
            //             if(j == viewArr.length-1){
            //                 // console.log("judgeImportSound",viewArr,this.soundRes);
                            
            //             }
                        
            //         }else{
            //             console.log("data");

            //         }
            //     }
            //     catch(err){
            //         console.log("err",err);
            //         // if(j == viewArr.length-1){
            //         //     return new Promise(function(resolve,reject){
            //         //         if(j != viewArr.length-1){
            //         //             reject();
            //         //         }else{
            //         //             resolve(i);
            //         //         }
            //         //     })
            //         // }
            //     }
            // }
        }
        // console.log("cfgjson",typeof(cfgjson),cfgjson,cfgjson.pages[1].subviews[0].view);
    }
    /********************判定as文件导入了哪些UI类********************** */
    async setImportUi(viewArr:string[]):Promise<any>{
        let uiExtname : string[] = [];
        for (let j = 0; j < viewArr.length; j++) {
            let Aspath  = viewArr[j];
                let data : string = await this.readFileFunc(Aspath);
                if(data){
                    uiExtname = this.judgeImportUI(data,uiExtname);
                    if(j == viewArr.length-1){
                    return new Promise(function(resolve,reject){
                        resolve(uiExtname);
                    })
                    }
                    
                }else{
                    console.log("data");

                }
            }
    }
/********************判定as文件导入了的UI类导入的声音********************** */
async getSoundRes(viewArr:string[]):Promise<any>{
    let soundRes : string[] = [];
    for (let j = 0; j < viewArr.length; j++) {
        let Aspath  = viewArr[j];
        try{
            let data : string = await this.readFileFunc(Aspath);
            if(data){
                soundRes = this.judgeImportSound(data,soundRes);
                if(j == viewArr.length-1){
                return new Promise(function(resolve,reject){
                    resolve(soundRes);
                })
                }
            }else{
                console.log("data");
            }
        }
        catch(err){
            console.log("err",err);
            // if(j == viewArr.length-1){
            //     return new Promise(function(resolve,reject){
            //         if(j != viewArr.length-1){
            //             reject();
            //         }else{
            //             resolve(i);
            //         }
            //     })
            // }
        }
    }
}
    /********************判断as文件导入UI类********************** */
    judgeImportUI(data:string,uiExtname:string[]):string[]{
        let importUIArr : string[] = this.getUIClass();
        for (let index = 0; index < importUIArr.length; index++) {
            let UIArr :any = importUIArr[index];
            let str : string = "";
            for (let i = 0; i < UIArr.length; i++) {
                const UI = UIArr[i];
                if(i == UIArr.length-1){
                    str+=UI
                    }else{
                        str+=UI+"."
                    }
            }
            if(str&&data.includes(str)){
                let basename : string = UIArr[UIArr.length-1].replace("UI","");
                if(!uiExtname.includes(basename)){
                    uiExtname.push(basename); 
                }
                break
            }
        }
        return uiExtname;
        //console.log("bingo",this.UIName);
    }
/****************获取src/ui下的所有ui类名******************* */
    getUIClass():Array<string>{
        let arrpath :string[] = [];//ui类绝对路径
        let UInameArr :any = [];//最终的数组ui.UI类
        this.pathArr = [];
        let filePath : string = this.getFilePath(this.filepathSplit,3,"/src/ui");
        arrpath = this.imgFileDisplay(filePath,arrpath);
        for (let index = 0; index < arrpath.length; index++) {
            var uinamearr : string[] = [];
            const path1 = arrpath[index];
            let splitArr : string[] = path1.split("\\");
            let idx : number = splitArr.indexOf("src");
            let extname : string = path.extname(path1);
            if(idx!=-1){
                for (let i = idx+1; i < splitArr.length; i++) {
                    let splitEle = splitArr[i];
                    splitEle = splitEle.replace(extname,"");
                    uinamearr.push(splitEle);
                    // if(i == splitArr.length-1){
                    //     sampleStr+=splitEle
                    // }else{
                    //     sampleStr+=splitEle+"."
                    // }
                }
            }
            UInameArr.push(uinamearr);
        }
        return UInameArr;
    }

    /********************判断as文件导入声音********************** */
    judgeImportSound(data:string,soundResArr:string[]):string[]{
        let importUIArr : string[] = this.getdirSound();
        for (let index = 0; index < importUIArr.length; index++) {
            let UIArr :any = importUIArr[index];
            let str : string = "";
            for (let i = 0; i < UIArr.length; i++) {
                const UI = UIArr[i];
                if(i == UIArr.length-1){
                    str+=UI
                    }else{
                        str+=UI+"/"
                    }
            }
            if(str&&data.includes(str)){
                //let basename : string = UIArr[UIArr.length-1].replace("UI","");
                // if(!this.UIName.includes(basename)){
                //     this.UIName.push(basename); 
                // }
                console.log("str",str);
                
                soundResArr.push(str);
                // break
            }
        }
        return soundResArr;
        // console.log("bingo",this.UIName);
    }
    /****************获取asset下的所有声音路径******************* */
    getdirSound():Array<string>{
        let arrpath :string[] = [];//ui类绝对路径
        let soundResArr :any = [];//最终的数组ui.UI类
        this.pathArr = [];
        let filePath : string = this.getFilePath(this.filepathSplit,1);
        arrpath = this.imgFileDisplay(filePath,arrpath);
        for (let index = 0; index < arrpath.length; index++) {
            var soundresarr : string[] = [];
            const path1 = arrpath[index];
            let splitArr : string[] = path1.split("\\");
            let idx : number = splitArr.indexOf("assets");
            let extname : string = path.extname(path1);
            if(idx!=-1 && (extname == ".wav" || extname == ".ogg"|| extname == ".mp3")){
                for (let i = idx+1; i < splitArr.length; i++) {
                    let splitEle = splitArr[i];
                    soundresarr.push(splitEle);
                }
                soundResArr.push(soundresarr);
            }
        }
        return soundResArr;
    }
/****************绝对路径拼接路径**************** */
    getRelativepath(splitNum:number,addPath:string,searchKey : string):any{
        let relativeArr : any = [];
        let arrpath :string[] = [];//绝对路径
        let filePath : string = this.getFilePath(this.filepathSplit,splitNum,addPath);
        arrpath = this.imgFileDisplay(filePath,arrpath);
        for (let index = 0; index < arrpath.length; index++) {
           //let uinamearr : string[] = [];
            const path1 = arrpath[index];
            let splitArr : string[] = path1.split("\\");
            let idx : number = splitArr.indexOf(searchKey);
            let relativeStr : string = ""
            // let extname : string = path.extname(path1);
            if(idx!=-1){
                for (let i = idx+1; i < splitArr.length; i++) {
                    //let splitEle = splitArr[i];
                    if(i != splitArr.length-1){
                        relativeStr += splitArr[i] + "/"
                    }else{
                        relativeStr += splitArr[i];
                    }
                    // splitEle = splitEle.replace(extname,"");
                    //uinamearr.push(relativeStr);
                   
                    // if(i == splitArr.length-1){
                    //     sampleStr+=splitEle
                    // }else{
                    //     sampleStr+=splitEle+"."
                    // }
                }
            }
            relativeArr.push(relativeStr);
        }
        return relativeArr;
    }

/****************返回图片路径数组******************* */
    getImgPathArr():string[]{
        let pathArr :string[] = [];
        let imgPath : string = this.getImgPath();
        this.tempPath = this.imgFileDisplay(imgPath,pathArr);
        // console.log(this.tempPath);
        return this.tempPath;
    }
/****************将资源路径push数组******************* */
    imgFileDisplay(filePath:string,pathArr :string[]):Array<string>{
        try{
            let files = fs.readdirSync(filePath);
            //console.log("files",files);
        for(let filename of files){
            
            const filepath  = path.join(filePath,filename);
            const stats = fs.statSync(filepath);
            const isFile = stats.isFile();
            const isDir = stats.isDirectory();
            if(isFile){
                
                //console.log("filepath",filepath);
                pathArr.push(filepath);
            }
            if(isDir){
                // if(filename == this.STR_SHARE || filename == this.STR_RES){
                //     continue
                // };
                if(filename == this.STR_RES){
                    continue
                };

                this.imgFileDisplay(filepath,pathArr);
            }
        }
        return pathArr;
        }catch(err){
            // console.log(err);
            return pathArr;
        }
       // console.log("files",files);
    }
    /************************************** */
    /****************将资源路径push数组******************* */
    aniFileDisplay(filePath:string,pathArr :string[],basename: string):Array<string>{
        try{
            let files = fs.readdirSync(filePath);
            //console.log("files",files);
        for(let filename of files){
            const filepath  = path.join(filePath,filename);
            let exTname : string = path.extname(filepath);
            let findeResBasename : string = path.basename(filepath,exTname).replace(/[0-9]/g,"");
            const stats = fs.statSync(filepath);
            const isFile = stats.isFile();
            const aniBasenameLetter : string = basename.replace(/[0-9]/g,"");
            if(isFile && aniBasenameLetter == findeResBasename && exTname == ".png"){
                //console.log("filepath",filepath);
                pathArr.push(filepath);
            }
        }
        return pathArr;
        }catch(err){
            console.log(err);
            return pathArr;
        }
       // console.log("files",files);
    }
/****************返回图片路径******************* */
    getImgPath():string{
        let filePath : string = this.getFilePath(this.filepathSplit,3,"/bin/h5");
        return filePath;
    }
/****************拼接需要搜索的路径******************* */
    getFilePath(strArr:string[],num : number = 0,outpath:string = ""):string{
        let Path : string = "";
        for (let index = 0; index < strArr.length-num; index++) {
            let element = strArr[index];
            if(index == strArr.length-num-1){
                Path += element;
            }else{
                Path += element + "/";
            }
            
        }
        Path = Path + outpath;
        //console.log("Path",Path);
        return Path;
    }
}

