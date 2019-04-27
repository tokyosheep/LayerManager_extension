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

function save(obj){
    alert(obj[1]);
    alert(obj[0]);
}