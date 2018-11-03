get_layer();//必ず関数から呼び出す形にする　でないとextension側にjsonデータを送れない
//artLayers = フォルダ以外のレイヤー　layers = フォルダ含めての全てのレイヤー
function get_layer(){
    
        function isFolder(type){
                if(type === "undefined"){
                        return "folder";
                 }else{
                        return type;
                 }
        }
     
        var Get_layers = function(doc){
                this.type = [];
                this.name = [];
                this.folders = [];
                for(var i = 0; i<doc.layers.length;i++){
                        this.name[i] = doc.layers[i].name;
                        this.type[i] = isFolder(String(doc.layers[i].kind));//元々objct型なのでstring型に変換
                        $.writeln(this.type[i]);                
                        if(this.type[i] === "folder"){//フォルダーがある限り再帰的にオブジェクトを作成
                                var folder = new Get_layers (doc.layers[i]);
                                this.folders[i] = folder;
                        }else{
                                this.folders[i] = null;
                        }
                }
        }
    var layers = new Get_layers (activeDocument);     
    //$.write(layers.folders);
    return JSON.stringify(layers);
 }