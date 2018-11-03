/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/


function process(obj){
    //go_action(obj.child_act,obj.parent_act);
    set_layers(activeDocument.layers,obj.layers);
    
    function set_layers(set,obj){    
    
        for(var i=0;i<obj.length;i++){
                if(obj[i].checked){
                    set[obj[i].name].visible = false;
                }
                if(obj[i].type==="folder"){
                    //alert (obj[i].list[0]);
                        set_layers(set[obj[i].name].layers,obj[i].list);
                }
        }    
    
    }

  
    function go_action(child,set){
    try{
        doAction(child,set);
        return true;    
    }catch(e){
        return false;
    }  
    }//end of go_action    
    
    function select_action(obj){
            switch(obj){
                
            }
    }
    
    }
