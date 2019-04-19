function dashboard() {
  util_guaranteeScriptsAvailable();
  
  var dashboard = util_getContainerSpreadsheet().getSheetByName(
    PropertiesService.getScriptProperties().getProperty('DASHBOARD_SHEETNAME'));
  dashboard_updateValues();
  dashboard_updateFields(dashboard);
}

function dashboard_updateValues(){
  loaner_getUpdate();
  suggestion_getUpdate();
  vote_getUpdate();
}

function dashboard_updateFields(dashboard){
  var publicProperties = PropertiesService.getDocumentProperties().getProperties();
  var scriptProperties = PropertiesService.getScriptProperties().getProperties();
  
  var range = dashboard.getRange(1, 2, dashboard.getMaxRows(), 2);
  range.clear();
  range.clearNote();
  
  var sortedKeys = Object.keys(publicProperties).sort();
  //add additional rows as necessary
  if(dashboard.getMaxRows() < sortedKeys.length){
    dashboard.insertRowsAfter(scriptProperties['INSTALL_NOTIFIER_LENGTH'],sortedKeys.length - scriptProperties['INSTALL_NOTIFIER_LENGTH']);
  }
  
  var rangeValues = [];
  var rangeNotes = [];
  for(var i = 0; i < sortedKeys.length; i++){
    rangeValues.push([sortedKeys[i],publicProperties[sortedKeys[i]]]);
    rangeNotes.push([scriptProperties[(sortedKeys[i]+'_desc')]]);
  }
  rangeValues.push(['Last Updated:',new Date()])
  //two columns for key and value pairs
  range = dashboard.getRange(1, 2, rangeValues.length, 2);
  range.setValues(rangeValues);
  //single column for notes
  range = dashboard.getRange(1, 2, rangeNotes.length, 1);
  range.setNotes(rangeNotes);
}
