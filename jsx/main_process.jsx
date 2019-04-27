/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/


function process(obj){
    
    //go_action(obj.child_act,obj.parent_act);
    set_layers(activeDocument,obj,obj.layers);
    return "finish";
    function set_layers(act,obj,list){//actアクティブレイヤー（レイヤーセット） obj　extensionからのオプションデータ　list extensionからのレイヤーリスト    
        for(var i=0;i<list.length;i++){
                if(list[i].checked){
                    if(!pros_type(act,obj,i)){
                            return;
                      }
                }
                if(list[i].type==="folder"&&list[i].checked){
                        set_layers(app.activeDocument.activeLayer,obj,list[i].layers);//再帰的にレイヤーフォルダーを処理
                }
        }    
    
    }

  
    function go_action(child,set){
    try{
        doAction(child,set);
        return true;    
    }catch(e){
        alert (e);
        return false;
    }  
    }//end of go_action    
    
    function pros_type(act,obj,i){
            app.activeDocument.activeLayer = act.layers[i];
            var aclayer = app.activeDocument.activeLayer;
            var lay_length = app.activeDocument.layers.length;
            switch(obj.pros_type){
                    case "action" :  
                        if(!laytype(LayerKind.NORMAL,LayerKind.SMARTOBJECT)){
                            break;
                        }
                        act.layers[i].visible = true;
                        go_action(obj.child_act,obj.parent_act);
                        if(aclayer !== app.activeDocument.activeLayer||lay_length !== app.activeDocument.layers.length){
                         alert ("you changed active layer!!");
                            return false;
                         }
                        break; 
                        
                    case "smart_on" : 
                        if(laytype(undefined)){
                                break;
                        }
                        act.layers[i].visible = true ;
                        var id67 = stringIDToTypeID( "newPlacedLayer" );
                        executeAction( id67, undefined, DialogModes.NO );
                        break;
                        
                    case "smart_off" : 
                         if(!laytype(LayerKind.SMARTOBJECT)){
                            break;
                        }
                        act.layers[i].visible = true ;
                        act.layers[i].rasterize(RasterizeType.LINKEDLAYERS);
                        break;
                        
                    case "show_lay" : 
                        act.layers[i].visible = true ;
                        break;
                        
                    case "hide_lay" : 
                        act.layers[i].visible = false ;
                        break;
                        
                    case "rotate":
                        if(!laytype(LayerKind.NORMAL,LayerKind.SMARTOBJECT)){
                            break;
                        }
                        act.layers[i].visible = true ;
                        activeDocument.activeLayer.rotate(obj.rotate);
                        break;
                        
                    case "move":
                        if(!laytype(LayerKind.NORMAL,LayerKind.SMARTOBJECT)){
                                   break;
                        }
                        act.layers[i].visible = true ;
                        activeDocument.activeLayer.translate(obj.horizontal,obj.vertical);
                    break;
                    
                    default : break;
            }
            return true;
    }

    function laytype(){
            for(var j=0;j<arguments.length;j++){
                    if(activeDocument.activeLayer.kind===arguments[j]){
                            return true;
                    }
            }
            return false;
    }
    
}

/*
function typeOfObject(obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return clas;
}

loadjson();
function loadjson(){//デバッグ用json取得関数
    #include "json2.js";//json2読み込み
    var f = new File($.fileName);
    var jsx = f.parent;
    var main_folder = jsx.parent;
    var path = main_folder+"/js/preset.json";
    var json = new File(path);
    var flag = json.open("r");
    if(flag){
        var o = json.read();
        var obj = JSON.parse(o);
        save_layers(obj[0]);
        json.close();
    }
}
*/

function save_layers(Objects){
    preferences.rulerUnits = Units.PIXELS;
    //alert(Objects.obj_condition.formats[0].id);
    /*
    if(!PSD()){//psdが保存できなかったらエラー扱い
        alert("It can't save PSD!!");
        return;
    }
    */
    function PSD(){
        try{
            var  fileObj = new File(activeDocument.fullName);            
            psdOpt = new PhotoshopSaveOptions();
            psdOpt.alphaChannels = true;
            psdOpt.annotations = true;
            psdOpt.embedColorProfile = true;
            psdOpt.layers = true;
            psdOpt.spotColors = false;
            activeDocument.saveAs(fileObj, psdOpt, true, Extension.LOWERCASE);  
            return true;
        } catch(e){
            return false;
        } 
    }

    function init(parent_layers){//指定したレイヤー下のレイヤーを非表示にする
        for(var i=0;i<parent_layers.length;i++){
            parent_layers[i].visible = false;
        }
    }

    function makefolder(){
        for(var no =0; no<arguments.length; no++){//引数に渡された数だけフォルダを作る
            var folderObj = new Folder(arguments[no]);
            folderObj.create();
        }
    }

    var Main_process = function(obj){
        this.layers = obj.obj_layer.layers;
        this.condition = JSON.parse(JSON.stringify(obj.obj_condition));//オブジェクトを参照渡しではなくコピーする
        this.path_name;
        this.ResizeFlag;//リサイズのフラッグを代入するためのプロパティ
    }
    

    Main_process.prototype.saving = function(folder,parent_layer){
        init(parent_layer);
        var folder_layer = folder;
        $.writeln(parent_layer);
        for(var n = 0;n<folder_layer.length;n++){
            if(folder_layer[n].checked){
                activeDocument.activeLayer = parent_layer[n];
                parent_layer[n].visible = true;
                if(folder_layer[n].type === "folder"){
                    this.back_before(folder_layer[n].layers,parent_layer[n].layers);
                    this.exporting();
                    this.saving(folder_layer[n].layers,parent_layer[n].layers);//フォルダーレイヤーが有る限り再帰的に処理
                }else{
                    this.exporting();
                }
                parent_layer[n].visible = false;
            }
        }
    }

    Main_process.prototype.back_before = function(folder,parent_layer){
        for(var n = 0;n<folder.length;n++){
            if(folder[n].checked){
                parent_layer[n].visible = true;
            }
            if(folder[n].type === "folder"){
                this.back_before(folder[n].layers,parent_layer[n].layers);
            }
            
        }
    }

    Main_process.prototype.getpath = function(){
        //---------------別名保存用のパス------------------
        //====拡張子抜き出し=====
        var fPath = activeDocument.path;
        var fname = activeDocument.name//ドキュメントの名前を読み込み
        
        //ファイル名を取得
        var l = fname.length;//ファイル名の長さ
        var s = l-4//ファイル名の長さ-拡張子分の文字(4)
        var original_name = fname.substr(0,s);//拡張子を除いたファイルの名前を抜き出し
        
        this.fPath = fPath;
        this.docName = activeDocument.fullName;//ドキュメントの絶対パス
        this.fname = fname;
        this.original_name = original_name;
     }/*=========== getpath=========*/

    Main_process.prototype.resize = function(){
        if(!this.ResizeFlag){
            return false;
        }
        var Doper = parseFloat (this.condition.size_value.value);
        var w = activeDocument.width;
        var h = activeDocument.height;
        if(w>h){
            activeDocument.resizeImage(Doper,undefined,this.condition.res_value.value);
        }else{
            activeDocument.resizeImage(undefined,Doper,this.condition.res_value.value);
        }
        return true;
    }

    Main_process.prototype.exporting = function(){
        var flag = 0;
        var crop = new Crop_layer();
        crop.get_status(isChecked(main.condition.conditions,"crop"));
        if(crop.chooseOne()){//ここでトリミングします
            flag++;
        }
        this.ResizeFlag = isResize(this.condition);//リサイズのブーリアンを代入
        if(this.resize()){
            flag++
        }
        this.path_name = activeDocument.activeLayer.name;
        if(activeDocument.activeLayer.isBackgroundLayer){
            activeDocument.artLayers[activeDocument.artLayers.length-1].opacity = 100;
            flag++;
        }
        if(isChecked(this.condition.formats,"jpg")){
            this.jpeg();
        }
        if(isChecked(this.condition.formats,"tiff")){
            this.tiff();
        }
        if(isChecked(this.condition.formats,"png")){
            this.png();
        }
        if(isChecked(this.condition.formats,"gif")){
            this.gif();
        }
        
        if(flag !== 0){
            var story = app.activeDocument.historyStates.length;
            app.activeDocument.activeHistoryState = app.activeDocument.historyStates[story -(1+flag)];
            //クロップしたら元のサイズに戻す
        }

        function isResize(obj){
            if(!obj.Resize.checked){//リサイズボタンがオフだったらfalse
                return false;
            }
            var long_length;
            var width = activeDocument.width;
            var height = activeDocument.height;
            if(width < height){
                long_length = height;
            }else{
                long_length = width;
            }
            $.writeln(long_length);
            $.writeln("reisize is...");
            $.writeln(!(obj.size_value.value == long_length && obj.res_value.value == activeDocument.resolution));
            return !(obj.size_value.value == long_length && obj.res_value.value == activeDocument.resolution);
        }//resizeする前にresizeのサイズとリサイズ前のサイズが同じ出ないか確認
    }

    

    Main_process.prototype.jpeg = function(){
        var  fileObj = new File(this.make_path("jpeg"));  
        if(isChecked(this.condition.conditions,"sRGB")){        
            activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
            app.activeDocument.convertProfile(
            "sRGB IEC61966-2.1",
            Intent.PERCEPTUAL,//知覚的
            true, true );//黒点補正、ディザ補正 
        }
        jpegOpt = new JPEGSaveOptions();
        jpegOpt.embedColorProfile = true;
        jpegOpt.quality = this.condition.jpg_quality.value;
        jpegOpt.formatOptions = FormatOptions.STANDARDBASELINE;
        jpegOpt.scans = 3;
        jpegOpt.matte = MatteType.NONE;
        activeDocument.saveAs(fileObj, jpegOpt, true, Extension.LOWERCASE);
    }

    Main_process.prototype.tiff = function(){
        var  fileObj = new File(this.make_path("tiff"));
        tiffOpt = new TiffSaveOptions();
        tiffOpt.alphaChannels = false;
        tiffOpt.annotations = true;
        tiffOpt.byteOrder = ByteOrder.MACOS;
        tiffOpt.embedColorProfile = true;
        tiffOpt.imageCompression = TIFFEncoding.NONE;
        tiffOpt.jpegQuality = 12;
        tiffOpt.layerCompression = LayerCompression.RLE;
        tiffOpt.layers = false;//レイヤーを統合するかしないかのオプション個別のレイヤーを書き出すので常にオフ  
        tiffOpt.saveImagePyramid = false;
        tiffOpt.spotColors = false;
        //-----------------透過情報----------------------------------
        tiffOpt.transparency = isChecked(this.condition.conditions,"transparency");
        activeDocument.saveAs(fileObj, tiffOpt, true, Extension.LOWERCASE);    
    }

    Main_process.prototype.png = function(){
        var  fileObj = new File(this.make_path("PNG")); 
        pngOpt = new PNGSaveOptions();
        pngOpt.interlaced = false;
        activeDocument.saveAs(fileObj, pngOpt, true, Extension.LOWERCASE);
    }

    Main_process.prototype.gif = function(){
        var  fileObj = new File(this.make_path("GIF"));   
         gifOpt = new GIFSaveOptions();
         gifOpt.colors = 32;
         gifOpt.dither = Dither.NONE;
         gifOpt.interlacted = true;
         gifOpt.matte = MatteType.WHITE;
         gifOpt.palette = Palette.EXACT;
         gifOpt.preserveExactColors = false; 
         gifOpt.transparency = isChecked(this.condition.conditions,"transparency");
        activeDocument.saveAs(fileObj, gifOpt, true, Extension.LOWERCASE);          
    }

    Main_process.prototype.make_path = function(ext){
        var save_path;
        if(isChecked(this.condition.conditions,"each_folder")){
            makefolder(this.fPath +"/"+ext);
            save_path = this.fPath + "/" + ext + "/" + this.path_name;
        }else{
            save_path = this.fPath + "/" + this.path_name;
        }
        
        return save_path;
    }

    function isChecked(array,id){//checkboxの確認
        if(!Object.prototype.toString.call(array) === "[object Array]"){//arrayの判定（isArrayはecma5から）
            array = [array];
        }
        for(var j = 0;j<array.length;j++){
            if(array[j].id===id){
                return array[j].checked;
            }
        }
        alert("無効なidです");
        return null;
    }

    var Crop_layer = function(){}//crop mathod

    Crop_layer.prototype.get_status = function(flag){
        this.flag = flag;
        this.w = activeDocument.width;
        this.h = activeDocument.height;
        try{
            var rect = activeDocument.activeLayer.bounds;
            throw_bound(rect);
            this.left = rect[0];
            this.top = rect[1];
            this.right = rect[2];
            this.bottom = rect[3];
            
            /*
            var left02 = w - this.left;
            var right02 = w - this.right;
            var top02 = h - this.top;
            var bottom02 = h - this.bottom;
            */

        }catch(e){
            this.left = 0;
            this.top = 0;
            this.right = 0;
            this.bottom = 0;
            this.flag = false;
        }
        function throw_bound(array){//レイヤーの大きさが2ピクセル以下だったらエラー扱い
            $.writeln(rect);
            var count = 0;
            for(var l = 0;l < array.length;l++){
                var b = parseFloat(array[l]);
                if(b < 5){
                    count++
                }
            }
            if(count>2){
                throw "there's no bound";
            }
        }
    }

    Crop_layer.prototype.chooseOne = function(){
        if(!this.flag){
            return false;
        }
        activeDocument.crop([
            this.left,
            this.top,
            this.right,
            this.bottom
        ]);
        return true;
    }

    var main = new Main_process(Objects);
    main.getpath();
    main.saving(main.layers,activeDocument.layers);
    main.back_before(main.layers,activeDocument.layers);
    return; 
    
}