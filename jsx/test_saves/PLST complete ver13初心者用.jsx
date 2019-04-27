/*
<javascriptresource>
<name>PLSTcompletever13</name>
<menu>filter</menu>
<about>plst</about>
<category>plstの各処理を完全自動化</category>

</javascriptresource>
*/

preferences.rulerUnits = Units.PIXELS;
//画像チェックサイズ
(function(){
 var biginner = true  //初心者用の可否の変数  
    
if(1>documents.length){
alert ("まず最初にフォルダ内のタグを除く画像を開いてscriptを作動させてください。\n"
+"全てのjpeg画像をpsdにまとめます");    
return
    
    }    
    
    
var  SML = 0
acBL = activeDocument.activeLayer.isBackgroundLayer;


docObj = activeDocument.activeLayer;


//スマートオウブジェクト化とレイヤーのスマートオブジェクト化、すぐ上の各種レイヤーの透明度を100%化とオブジェクトの対象が微妙に異なるので注意
for (i=0; i<docObj.length; i++)
{
    docObj.layers[i].visible = true;

}
docObj = activeDocument.artLayers;
for (i=0; i<docObj.length; i++)//各種レイヤーの透明度を100%にするオウブジェクト化する対象がactiveDocument.artLayersと複数系になっているので注意
{
docObj[i].opacity = 100;
layType = docObj[i].kind;
if(layType==LayerKind.SMARTOBJECT){
 SML++   
 $.writeln (SML);
 $.writeln (layType);}
}



function checkSelection()
{
var flag = true;
try {
    var s = app.activeDocument.selection.bounds
}catch(e){
flag = false;
}
return flag;
}

if (checkSelection())
{ plstnumber();
}else{
  if ( SML>1)
{
    if(!plstphase3()){return}
    }
 else{if (  acBL==true ) 
{plstfirst();}
else {
 plastphase2();
}    
}
}

function checksize(pix){//サイズチェックと白抜き確認
    activeDocument.selection.selectAll();

activeDocument.selection.copy(true);

var destDoc=app.documents.add(//psdドキュメント作成
    2100,//横幅
    2900,//縦幅
   pix,//解像度
    "test",//ドキュメントの名前
    　　NewDocumentMode.RGB,//ドキュメントのカラーモード
     DocumentFill.TRANSPARENT,//キャンバスのデフォルトカラー
     1.0,//ピクセル縦横比
     BitsPerChannelType.EIGHT,//色深度
     "sRGB IEC61966-2.1"//プロファイル
        );
        
activeDocument.selection.selectAll();
        activeDocument.paste(true);
        activeDocument.selection.deselect();
        
fileObj = new File(Dpath +"/"+layName);
jpegOpt = new JPEGSaveOptions();
jpegOpt.embedColorProfile = true;
jpegOpt.quality = 12;
jpegOpt.formatOptions = FormatOptions.STANDARDBASELINE;
jpegOpt.scans = 3;
jpegOpt.matte = MatteType.NONE;
activeDocument.saveAs(fileObj, jpegOpt, true, Extension.LOWERCASE);        
        
        
        var newBoundsObj = app.activeDocument.activeLayer;
        
        var rect = newBoundsObj.bounds;
        var left = parseInt (rect[0])
        var top = parseInt (rect[1])
        var right = parseInt (rect[2])
        var bottom = parseInt (rect[3])

    

var _width = right - left;
var _height = bottom - top;

        
        if((_width!=2100)||(_height!=2900)){
alert ("背景が足りていません");            
            }
        
whitecheck()//白抜き確認        
        
        activeDocument.close(SaveOptions.DONOTSAVECHANGES);
     activeDocument.selection.deselect();
    }

//--------スマートオブジェクトに変換する関数----------
function convertlayer(){

function convertLayerToSmartObject(docRef) {
// アクション定義
var id67 = stringIDToTypeID( "newPlacedLayer" );
for (var x = 0; x < docRef.layers.length; x++) {
    
// 各レイヤーを選択
app.activeDocument.activeLayer = docRef.layers[x];
laytype = app.activeDocument.activeLayer.kind;
if (app.activeDocument.activeLayer.typename == "LayerSet") {
   
convertLayerToSmartObject(app.activeDocument.activeLayer);
} else  {if(LayerKind.NORMAL== laytype) {executeAction( id67, undefined, DialogModes.NO );//ノーマルレイヤー以外はラスタライズ化しない
// アクション実行
}
else{continue;

}
}
}
}

convertLayerToSmartObject(app.activeDocument);//スマートオブジェクトに変換関数実行
    
    
    }
//----------れいやーを統合する関数---------------
function plstfirst(){
    docName = activeDocument.fullName;//ドキュメントの絶対パス
PRF=docName.parent;
 var dName = activeDocument.name;
 
 

var w2 =0
var h2 =0    
    var sourceDocs=new Array();//ソースドキュメント用の配列を作成
 for(var i=0; i<app.documents.length; i++){
      var docobj = app.documents[i];
      app.activeDocument = docobj ;
            sourceDocs[i]=app.documents[i];//ソースドキュメント用の配列をつくりまずは格納そしてソースドキュメントを後に指定したらソースドキュメントを順番に閉じることができた

      
      w = activeDocument.width.value;
h = activeDocument.height.value;
if(w>w2){
    w2=w
    }
if(h>h2){
h2=h    
    }

$.writeln (w,h);
if(w>h){
    activeDocument.rotateCanvas(90);
    }
if((w<3000)||(h<4000)){
alert ("画像サイズがLではありません");
}

}


fRef = activeDocument.path;//ファイルパスのファイル名は親フォルダの名前になる

fileObj = new File(fRef);

fname = fileObj.name;




    var orgstr = decodeURI(fname); //日本語が正確に読み取れるように変換
	var previewValue=orgstr;
    var folderObj = new Folder(PRF);
var fileList = folderObj.getFiles();//フォルダー内のファイルを取得    
var Pname=0
   $.writeln (previewValue);
    for(var fl=0;fl<fileList.length; fl++){
        $.writeln (fileList[fl].name); 

if(previewValue+".psd"==fileList[fl].name)        {
    Pname++
    }
        }
    if(Pname>=1){
      var previewValue = previewValue+"+"
        }
    if(biginner==true){alert ("フォルダ名をそのままファイル名にします。ファイル名が2桁の番号とハイフンと七桁の番号になっているか確かめてください。");}
	myDocName=prompt("ドキュメントの名前を入力",previewValue);
	if(myDocName==""|| myDocName==null){return
}
	var destDoc=app.documents.add(//psdドキュメント作成
    w,//横幅
    h,//縦幅
   72,//解像度
    myDocName,//ドキュメントの名前
    　　NewDocumentMode.RGB,//ドキュメントのカラーモード
     DocumentFill.TRANSPARENT,//キャンバスのデフォルトカラー
     1.0,//ピクセル縦横比
     BitsPerChannelType.EIGHT,//色深度
     "sRGB IEC61966-2.1"//プロファイル
        );     
        
for  (var i=0; i<app.documents.length-2; i++){
    layObj = activeDocument.artLayers.add();
    }
        
     var filenum=0
 for(var r=0; r<sourceDocs.length; r++){//アクティブドキュメントのlengthではなく一度事前に取得したソースゴキュメントlengthなのに注意
    
     app.activeDocument=sourceDocs[r];//
      
      activeDocument.selection.selectAll();//選択してコピー
      activeDocument.selection.copy();
      psdLName = activeDocument.name;//各種ドキュメントのファイル名を求める

//ファイル名を取得
l = psdLName.length;//ファイル名の長さ
s = l-4//ファイル名の長さ-拡張子分の文字(4)
DNname=psdLName.substr(0,s);//ファイル名の長さを元に拡張子以外を抜き出し
       activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      
      //-------psdドキュメント選択--------
        
         app.activeDocument = destDoc;
        
        docObj = activeDocument;//psdドキュメントのレイヤーを順番に選択
         docObj.activeLayer = docObj.layers[r];
activeDocument.artLayers[r].name =DNname;//各種レイヤーをドキュメントの名前に
activeDocument.paste(false);//ペースト

        }
    fileObj = new File(fRef+"/"+myDocName);//ファイル名が重ならないように処理
 for(var ff=0; ff<fileList.length; ff++){
 filename = fileList[ff];
fileNm = new File(filename);
fname = fileNm.name;//順番にファイルの名前を取得
    $.writeln (fname); 
    $.writeln (myDocName); 
     n = fname.indexOf(myDocName);
       if(n != -1){
       filenum++ 
        }

if( filenum>=1) {
     fileObj = new File(fRef+"/"+myDocName+ filenum);//同じファイル名のpsdファイルがあったら別名保存
    }
     
     }


    
    //PSD形式で保存

psdOpt = new PhotoshopSaveOptions();
psdOpt.alphaChannels = true;
psdOpt.annotations = true;
psdOpt.embedColorProfile = true;
psdOpt.layers = true;
psdOpt.spotColors = false;
activeDocument.saveAs(fileObj, psdOpt, true, Extension.LOWERCASE);    
    
  activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  if(biginner==true){alert ("開いたファイルを全てPSDにまとめました。PSDを開き、ハンガー、商品位置を合わせて形を整えて下さい。その後もう一度スクリプトを実行してください。");}

    }

function plastphase2(){
    //スマートオブジェクトに変換してトリミングする関数--------
    activeDocument.guides.removeAll();
     convertlayer()
     
//--------トリミング---------

w2 = activeDocument.width;
h2 = activeDocument.height;

AO=w2/2100
cropsizeH=2900*AO
cropsizetop=(h2/2)-(cropsizeH/2)
bottom=(h2/2)+(cropsizeH/2)

activeDocument.crop([0,cropsizetop,w2,bottom]);//取得した選択範囲のサイズにトリミング

activeDocument.resizeImage(2100,2900,96 );
         
for(var to=0;to<activeDocument.layers.length; to++){
    if(activeDocument.artLayers[to].kind==LayerKind.SMARTOBJECT){
   activeDocument.activeLayer = activeDocument.layers[to];     
        
    addplstlayer();}
    }
       if(biginner==true){alert ("各レイヤーをスマートオブジェクトに変換し、plstサイズにトリミングしました。アパレルの場合は定規の0mmから600mmまで長方形選択範囲で引いてスクリプトを実行してください。\n"+
"グッズの場合はこの工程を省いて手動で大きさを調整して下さい");}
    }



function plstphase3()
{//-----最後に書き出すための関数-------
answn = prompt("解像度を入力してください","72");//解像度入力
var pix = parseFloat (answn);
if(isNaN(pix)||(pix<50)||(pix>300))
{alert ("正常な数値を入力してください");
    return false
    }
acdocObj = activeDocument;
for (var n=0; n<acdocObj.layers.length; n++)
{
acdocObj.layers[n].visible = false;
}//レイヤーをすべて非表示に

for (var r=0; r<acdocObj.layers.length; r++ )
{//レイヤーを一つずつ表示してjpegで書き出す
    layName = activeDocument.artLayers[r].name;
    acdocObj.layers[r].visible =true
        Dpath = activeDocument.path;
        if(r!=0){
        checksize(pix)//ラスタライズレイヤーチェック
        }else{
fileObj = new File(Dpath +"/"+layName);
jpegOpt = new JPEGSaveOptions();
jpegOpt.embedColorProfile = true;
jpegOpt.quality = 12;
jpegOpt.formatOptions = FormatOptions.STANDARDBASELINE;
jpegOpt.scans = 3;
jpegOpt.matte = MatteType.NONE;
activeDocument.saveAs(fileObj, jpegOpt, true, Extension.LOWERCASE);                  
            }


    acdocObj.layers[r].visible =false
    }

for (var n=0; n<acdocObj.layers.length; n++)
{
acdocObj.layers[n].visible = true;
}//最後にレイヤーをすべて表示して元に戻す
    alert ("保存処理が終了しました");
     if(biginner==true){ alert ("ファイル名を元にトリミングサイズを決めます。ファイル名が2桁とハイフンと7桁からなる品番名になっていれば自動でトリミングサイズをきめてくれます。\n"+
   "グッズの場合はこの工程は不要なのでキャンセルして下さい。また商品がアパレルで頭2桁が62等のサンプルの場合や無効な番号の場合は自分でトリミングサイズを決めます。\n"+
   "わからなければ商品がワンピースなのか、シャツなのか聞いてから該当の番号を選択してください。");}
    }

function plstnumber(){
    flag = confirm("ファイル名から品番を読み込みますか？");
    if (flag == true){
dName = activeDocument.name;


var result31 = dName.match(/[0-9]{2}[-_][0-9]{7}/);//["U"]Uに完全一致
if(result31==null){
alert ("適切な番号ではありません");
plstchoicetrimming();
    }else{
str1 =  result31.toString();

chr  = str1.substring(0,2);//頭2列きりだし（メンズかウィメンズか）
//正規表現できりだした文字は一度stringで変換しないと文字列にならない
chr2  = str1.substring(6,10);//後ろ4桁切り取り（品番）
var num = chr2/1000;
$.writeln (num);   
num2 = Math.floor(num) * 1000;　//小数点三桁以下切捨て
$.writeln (num2);  
$.writeln (chr);  


if ( (chr==12 )||(chr ==13)){womens();
}else{
if( (chr==36 )||(chr ==37)){mens();
}else{
    if( chr==62) { alert( "サンプルです" );
    }else{
    alert( "適正な番号ではありません" );//上記以外の番号の場合警告
     plstchoicetrimming();
}
}
}
}
}else{
     plstchoicetrimming();
    }
function mens(){
    if ((num2 ==1000) || (num2== 2000) ||(num2== 3000) ||(num2== 4000)|| (num2== 8000)||(num2== 9000))
    {categorytrimming(1671);
         text("category.1");
} else{
  if (num2== 6000){
      categorytrimming(1276);
       text("category.5"  );
}else{
    alert( "適正な番号ではありません" );//上記以外の番号の場合警告
  plstchoicetrimming();
 }
}
}
    
    }


function womens(){
    
      if ((num2 ==1000)||(num2== 2000)||(num2== 3000)||(num2== 4000)||(num2== 8000)) {
categorytrimming(1671);
         text("category.1");
} else{


  if (num2== 9000){
   categorytrimming(1311);
  text("category.2")   
} else{
  if (num2== 5000){
categorytrimming(1371);
       text("category.3")
} else{
  if ((num2== 6000)||(num2== 7000)){
      categorytrimming(1371);
      text("category.4");
} else{
    alert( "適正な番号ではありません" );//上記以外の番号の場合警告
    plstchoicetrimming();
  }
}
}

}
}


function categorytrimming(trimsize){
    
    docObjL = activeDocument;//一番上のレイヤー選択
docObjL.activeLayer = docObjL.layers[0];    

app.activeDocument.selection.resizeBoundary(3000,100)//選択範囲を変形

rect = app.activeDocument.selection.bounds;//選択範囲の位置を取得（ここでは配列で取得しただけ）
w = activeDocument.width;//アクティブドキュメントの幅、高さのサイズを取得
h = activeDocument.height;

reft = rect[0];
top = rect[1];
right = rect[2];
bottom = rect[3];

activeDocument.selection.deselect();//選択範囲解除
activeDocument.crop([reft,top,right,bottom]);//取得した選択範囲のサイズにトリミング


app.activeDocument.resizeImage (undefined, trimsize, 96)//一番目の横幅は省力して縦幅に自動的に尺度をあわせてくれる


activeDocument.resizeCanvas(2100,2900,AnchorPosition.MIDDLERIGHT);//キャンパスサイズをplstのサイズに変更

w3 = activeDocument.width;
h3 = activeDocument.height;


  activeDocument.guides.add(Direction.HORIZONTAL, 65);//ガイド追加
    activeDocument.guides.add(Direction.HORIZONTAL, h3/2);
activeDocument.guides.add(Direction.VERTICAL, w3/2);

    }
function text(trimnumber){//トリミングカテゴリー番号出力
var appddocobj = app.documents[0];
app.activeDocument = appddocobj;


preferences.rulerUnits = Units.PIXELS;
w = activeDocument.width;
h = activeDocument.height;

w = activeDocument.width.value;
h = activeDocument.height.value;

var s = w+h;
var textsize = s/21

var pointColor = new SolidColor;//フォントの色を定義
pointColor.rgb.red = 40;
pointColor.rgb.green = 40;
pointColor.rgb.blue = 40;

preferences.rulerUnits = Units.POINTS;
docObj = app.activeDocument
layObj = docObj.artLayers.add();
layObj.kind = LayerKind.TEXT;
layObj.textItem.position = Array(w/5,h/2); //座標
layObj.textItem.contents = trimnumber;//カテゴリー番号の変数
layObj.textItem.size = textsize ;
layObj.textItem.color = pointColor; //色




 
 
 //レイヤーをスマートオブジェクトに変換
convertLayerToSmartObject(app.activeDocument);
//アクティブなレイヤーを一度何か変数に入れなおして変換していると思われるが構造がまだよくわからない
function convertLayerToSmartObject(docRef) {
// アクション定義
var id67 = stringIDToTypeID( "newPlacedLayer" );

if (app.activeDocument.activeLayer.typename == "LayerSet") {
convertLayerToSmartObject(app.activeDocument.activeLayer);
} else {
// アクション実行
executeAction( id67, undefined, DialogModes.NO );

}
}
//---
}

function whitecheck(){
    
//------色域および色の置き換えはjavascriptでコントロールできないのでレイヤーをつくりそのレイヤーに確認したい背景色を塗りつぶす。そして差の絶対値で背景の色と一致しているか確認という方法で白抜き確認を実現-----
RW=245
GW=245
BW=245



layObj = activeDocument.artLayers.add();

RGBColor = new SolidColor();//レイヤーを新しく作り確認する背景色の色で塗りつぶすそれを差の絶対値で確認指定した色と背景のいろがあっていればその部分は0の真っ黒な色になる
RGBColor.red = RW;
RGBColor.green = GW;
RGBColor.blue = BW;
activeDocument.selection.selectAll();
activeDocument.selection.fill(RGBColor,ColorBlendMode.NORMAL, 100, false);//新しく作成したレイヤーに塗りつぶしを適用

activeDocument.selection.deselect();
laydocObj = activeDocument.artLayers;
laydocObj[0].blendMode = BlendMode.DIFFERENCE;//レイヤーモードを差の絶対値に


if (app.activeDocument.artLayers.length > 1)//for文必ず数値は毎回異なる変数名を入力変数をまとめる!
{
app.activeDocument.mergeVisibleLayers();
}
//色の置き換え（scriptlistenenから取得したもの）
//0の値の黒を255のハイライトに変換
var idRplC = charIDToTypeID( "RplC" );
    var desc4 = new ActionDescriptor();
    var idFzns = charIDToTypeID( "Fzns" );
    desc4.putInteger( idFzns, 0 );
    var idMnm = charIDToTypeID( "Mnm " );
        var desc5 = new ActionDescriptor();
        var idLmnc = charIDToTypeID( "Lmnc" );
        desc5.putDouble( idLmnc, 0 );
        var idA = charIDToTypeID( "A   " );
        desc5.putDouble( idA, 0.000000 );
        var idB = charIDToTypeID( "B   " );
        desc5.putDouble( idB, 0.000000 );
    var idLbCl = charIDToTypeID( "LbCl" );
    desc4.putObject( idMnm, idLbCl, desc5 );
    var idMxm = charIDToTypeID( "Mxm " );
        var desc6 = new ActionDescriptor();
        var idLmnc = charIDToTypeID( "Lmnc" );
        desc6.putDouble( idLmnc, 0 );//0.35刻みで255の1ポイント相当?
        var idA = charIDToTypeID( "A   " );
        desc6.putDouble( idA, 0.000000 );
        var idB = charIDToTypeID( "B   " );
        desc6.putDouble( idB, 0.000000 );
    var idLbCl = charIDToTypeID( "LbCl" );
    desc4.putObject( idMxm, idLbCl, desc6 );
    var idH = charIDToTypeID( "H   " );
    desc4.putInteger( idH, 0 );
    var idStrt = charIDToTypeID( "Strt" );
    desc4.putInteger( idStrt, 0 );
    var idLght = charIDToTypeID( "Lght" );
    desc4.putInteger( idLght, 100 );
    var idcolorModel = stringIDToTypeID( "colorModel" );
    desc4.putInteger( idcolorModel, 0 );
executeAction( idRplC, desc4, DialogModes.NO );
//レイヤーの数を再度取得、階調を反転
LAdocObj = activeDocument.artLayers;
LAdocObj[0].invert()

    foldername = Folder.desktop+"\\whitecheck"//フォルダ作成
folderObj = new Folder(foldername);
folderObj.create();





fileObj = new File(foldername+"/"+layName);//whitecheckフォルダの中に保存ファイル名はレイヤーの名前
jpegOpt = new JPEGSaveOptions();
jpegOpt.embedColorProfile = true;
jpegOpt.quality = 12;
jpegOpt.formatOptions = FormatOptions.STANDARDBASELINE;
jpegOpt.scans = 3;
jpegOpt.matte = MatteType.NONE;

activeDocument.saveAs(fileObj, jpegOpt, true, Extension.LOWERCASE);


    
    }



function addplstlayer(){
// =======================================================
var idAdobeScriptAutomationScripts = stringIDToTypeID( "AdobeScriptAutomation Scripts" );
    var desc1 = new ActionDescriptor();
    var idjsNm = charIDToTypeID( "jsNm" );
    desc1.putString( idjsNm, """ScriptListenerOn""" );
    var idjsMs = charIDToTypeID( "jsMs" );
    desc1.putString( idjsMs, """[ActionDescriptor]""" );
executeAction( idAdobeScriptAutomationScripts, desc1, DialogModes.NO );

// =======================================================
var idplacedLayerEditContents = stringIDToTypeID( "placedLayerEditContents" );//スマートオブジェクトからPSBファイルひらく
    var desc2 = new ActionDescriptor();
executeAction( idplacedLayerEditContents, desc2, DialogModes.NO );




var idMk = charIDToTypeID( "Mk  " );//PLST塗りつぶしレイヤー作成
    var desc4 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref1 = new ActionReference();
        var idcontentLayer = stringIDToTypeID( "contentLayer" );
        ref1.putClass( idcontentLayer );
    desc4.putReference( idnull, ref1 );
    var idUsng = charIDToTypeID( "Usng" );
        var desc5 = new ActionDescriptor();
        var idType = charIDToTypeID( "Type" );
            var desc6 = new ActionDescriptor();
            var idClr = charIDToTypeID( "Clr " );
                var desc7 = new ActionDescriptor();
                var idRd = charIDToTypeID( "Rd  " );
                desc7.putDouble( idRd, 245 );
                var idGrn = charIDToTypeID( "Grn " );
                desc7.putDouble( idGrn, 245 );
                var idBl = charIDToTypeID( "Bl  " );
                desc7.putDouble( idBl, 245 );
            var idRGBC = charIDToTypeID( "RGBC" );
            desc6.putObject( idClr, idRGBC, desc7 );
        var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
        desc5.putObject( idType, idsolidColorLayer, desc6 );
    var idcontentLayer = stringIDToTypeID( "contentLayer" );
    desc4.putObject( idUsng, idcontentLayer, desc5 );
executeAction( idMk, desc4, DialogModes.NO );



//現在のレイヤーのマスクを選択
var idslct = charIDToTypeID( "slct" );
    var desc2 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref1 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idChnl = charIDToTypeID( "Chnl" );
        var idMsk = charIDToTypeID( "Msk " );
        ref1.putEnumerated( idChnl, idChnl, idMsk );
    desc2.putReference( idnull, ref1 );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc2.putBoolean( idMkVs, false );
executeAction( idslct, desc2, DialogModes.NO );

//-------------------------------------------
RGBColor = new SolidColor();//0ポイントの黒で塗りつぶす
RGBColor.red = 0;
RGBColor.green = 0;
RGBColor.blue = 0;
activeDocument.selection.selectAll();
activeDocument.selection.fill(RGBColor,ColorBlendMode.NORMAL, 100, false);//新しく作成したレイヤーに塗りつぶしを適用

activeDocument.selection.deselect();


activeDocument.activeLayer.name = "PLST";
saveAsPSB( activeDocument.fullName )
activeDocument.close(SaveOptions.DONOTSAVECHANGES);    
    function saveAsPSB( filePath ) {  //PSBファイル保存(scriptlistner)
      function cTID(s) { return app.charIDToTypeID(s); };  
      //function sTID(s) { return app.stringIDToTypeID(s); };  
      
      var desc7 = new ActionDescriptor();  
      var desc8 = new ActionDescriptor();  
      desc7.putObject( cTID('As  '), cTID('Pht8'), desc8 );  
      desc7.putPath( cTID('In  '), new File( filePath ) );  
      desc7.putBoolean( cTID('LwCs'), true );  
      executeAction( cTID('save'), desc7, DialogModes.NO );  
    };  
}

 function plstchoicetrimming()
 {
     uDlg = new Window('dialog','サンプル',[100,100,800,800]);
uDlg.listBox = uDlg.add("listbox",[40,30,600,130],["category,1 womens1000  2000 3000 4000 8000 　mens　1000　2000　3000　4000　8000　9000 " ,
"category,2　womens　9000","category.3　womens　5000","category.4　womens　6000 7000","category.5 mens 6000"], { multiselect:false});
uDlg.cancelBtn = uDlg.add("button", [50,500,145,500+25], "Cancel", {name: "cancel"});
uDlg.okBtn = uDlg.add("button",[240,500,325,500+25], "OK!", { name:"ok"});


uDlg.sText = uDlg.add("statictext",[40,160,310,160+35], "PLSTトリミング種別一覧");//固定テキスト
uDlg.listBox2 = uDlg.add("listbox",[40,200,600,300],["category1 womens.カットソー、ベスト、パーカーガーデン、ジャケット、シャツブラウス   mens.カットソー、ベスト、パーカー、シャツ、ブラウス、ジャケット、コート",
"category2 womens.コート","category3 womens.ワンピース", "category4 womens.パンツ、スカート","category5 mens.パンツ"], { multiselect:false});

uDlg.listBox2.enabled=false;

uDlg.okBtn.onClick=function(){
  
if(uDlg.listBox.selection==0){categorytrimming(1671);
         text("category.1");
    }else{if
        (uDlg.listBox.selection==1){ categorytrimming(1311);
  text("category.2");   
           }else{if
               (uDlg.listBox.selection==2){ categorytrimming(1371);
       text("category.3");  
       }else{if
                   (uDlg.listBox.selection==3){categorytrimming(1371);
      text("category.4");
      }else{if
                (uDlg.listBox.selection==4){categorytrimming(1276);
       text("category.5"  );   }else{
alert ("無効な数値です")                           
                           }
                     }
                   }
               }

     }
     uDlg.close(); 
    }

uDlg.cancelBtn.onClick=function(){
 uDlg.close(); 
   return;}
uDlg.show();
     }
})();