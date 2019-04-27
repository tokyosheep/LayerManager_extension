function getdocument_info(){
    
    var w = activeDocument.width//アクティブドキュメントの幅、高さのサイズを取得
    var h = activeDocument.height    
    
    try{
    var layo = app.activeDocument.activeLayer;
    var rect = layo.bounds;
    
    var left = rect[0]
    var top = rect[1]
    var right = rect[2]
    var bottom = rect[3]
    
    var left02 = w - left
    var right02 = w - right
    
    var top02 = h - top
    var bottom02 = h - bottom
    
    var laywidth = left02 - right02
    var layheight =  top02 - bottom02 
        
        
    if(laywidth>w){
    var laywidth = w; 
        }    
    
    if(layheight>h){
    var layheight = h;    
        }
    
      }catch(e){
     var laywidth = 0;    
     var layheight = 0;   
     
    rect[0] = 0;
    rect[1] = 0;
    rect[2] = 0;
    rect[3] = 0;
    }
    return {
w : w,
h : h,    
left :rect[0],
top :rect[1],
right :rect[2],
bottom :rect[3]
    } 
}

var f = getdocument_info();
app.activeDocument.crop([
    f.left,
    f.top,
    f.right,
    f.bottom,
    ]);