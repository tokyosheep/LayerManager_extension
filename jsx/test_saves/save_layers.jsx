(function(){
    var Objects = {
        obj_layer: {
            layers:[
                {
                    type:"LayerKind.NORMAL",
                    name:"レイヤー 2",
                    checked:true,
                    layers:""
                },
                {
                    type:"LayerKind.NORMAL",
                    name:"レイヤー 1",
                    checked:true,
                    layers:""
                },
                {
                    type:"LayerKind.NORMAL",
                    name:"レイヤー 0 のコピー",
                    checked:true,
                    layers:""
                },
                {
                    type:"folder",
                    name:"グループ 1",
                    checked:true,
                    layers:[
                        {
                            type:"LayerKind.NORMAL",
                            name:"レイヤー 0",
                            checked:true,
                            layers:""
                        }
                    ]
                },
                {
                    type:"LayerKind.SOLIDFILL",
                    name: "べた塗り 1",
                    checked:false,
                    layers:""
                },
                {
                    type:"LayerKind.SOLIDFILL",
                    name:"べた塗り 2",
                    checked:false,
                    layers:""
                }
            ]
        },
        obj_condition: {
            Resize:{checked:true},
            conditions:[
                {
                    id:"each_folder",
                    checked:true
                },
                {
                    id:"crop",
                    checked:true
                },
                {
                    id:"transparency",
                    checked:false
                },
                {
                    id:"sRGB",
                    checked:false
                }
            ],
            formats:[
                {
                    id:"jpg",
                    checked:true
                },
                {
                    id:"tiff",
                    checked:false
                },
                {
                    id:"png",
                    checked:false
                },
                {   id:"gif",
                    checked:false
                }
            ],
            jpg_quality:{
                value:12
            },
            res_value:{
                value:72
            },
            size_value:{
                value:2000
            }

        }
    }
    
    save_layers(Objects);
    function save_layers(Objects){
        preferences.rulerUnits = Units.PIXELS;
        $.writeln(Objects);
        if(!PSD()){//psdが保存できなかったらエラー扱い
            alert("It can't save PSD!!");
            return;
        }
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

        function init(){//最初に全てのレイヤーを非表示に
            for(var i=0;i<activeDocument.layers.length;i++){
                activeDocument.layers[i].visible = false;
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
            this.condition = obj.obj_condition;
            this.path_name;
        }
        

        Main_process.prototype.saving = function(folder){
            init();
            var folder_layer = folder;
            for(var n = 0;n<folder_layer.length;n++){
                if(folder_layer[n].checked){
                    activeDocument.activeLayer = activeDocument.layers[n];
                    activeDocument.layers[n].visible = true;
                    this.exporting();
                    if(folder_layer[n].type === "folder"){
                        this.saving(folder_layer[n].layers);//フォルダーレイヤーが有る限り再帰的に処理
                    }
                    activeDocument.layers[n].visible = false;
                }
            }
        }

        Main_process.prototype.back_before = function(folder){
            for(var n = 0;n<folder.length;n++){
                if(folder[n].checked){
                    activeDocument.layers[n].visible = true;
                }
                if(folder[n].type === "folder"){
                    this.back_before(folder[n].layers);
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
            if(!this.condition.Resize.checked){
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
            this.condition.Resize.checked = isResize(this.condition);
            if(crop.chooseOne()){
                flag++;
            }
            if(this.resize()){
                flag++
            }
            this.path_name = activeDocument.activeLayer.name;
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
                if(!obj.Resize.checked){
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
            tiffOpt.layers = true;//レイヤーを統合するかしないかのオプション  
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
            $.writeln(save_path);
            return save_path;
        }

        function isChecked(array,id){//checkboxの確認
            $.writeln(Object.prototype.toString.call(array));
            $.writeln(id);
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
        main.saving(main.layers);
        main.back_before(main.layers);

        
    }
})();