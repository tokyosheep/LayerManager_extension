/*
var myHistory = app.activeDocument.historyStates["開く"];
app.activeDocument.activeHistoryState = myHistory;
*/
alert(app.activeDocument.historyStates.length);
app.activeDocument.activeHistoryState = app.activeDocument.historyStates[app.activeDocument.historyStates.length -1];