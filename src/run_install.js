//some redundancies here - room for optimization
function install(){
  
  var warning = util_Warning('INSTALL_WARNING_TITLE','INSTALL_WARNING_DESC');
  if(warning == SpreadsheetApp.getUi().Button.NO) {
    //break
    Logger.log("User chose not to install");
    return;
  }
  var container = util_getContainerSpreadsheet();
  
  resetDocumentProperties();
  resetScriptProperties();
  resetUserProperties();
  
  install_resetSpreadsheet(container);
  install_buildDashboard(container.getActiveSheet());
  install_fillDashboard(container.getActiveSheet());
  install_installTriggers(container);
  
  PropertiesService.getDocumentProperties().setProperty('is_installed', true);
  
  configState();
  configSecrets();
  
  install_installLoaner();
  
  //updates all possible fields and forms
  install_forceUpdate();
}

function install_resetSpreadsheet(container){
  //if form exists, unlink it
  var form = container.getFormUrl();
  if(form != null){
    form.removeDestination();
  }
  
  //get existing sheets
  var sheetList = container.getSheets();
  //add new sheet
  container.insertSheet();
  //remove all old sheets
  for(var i = 0; i < sheetList.length; i++){
    container.deleteSheet(sheetList[i]);
  }
}

function install_buildDashboard(dashboard){
  var propServ = PropertiesService.getScriptProperties();
  dashboard.setName('Dashboard');
  
  //remove all cells except 1
  dashboard.deleteColumns(1, dashboard.getMaxColumns()-1);
  dashboard.deleteRows(1, dashboard.getMaxRows()-1);
  
  //add dashboard columns
  dashboard.insertColumnsAfter(1,2);
  dashboard.setColumnWidths(1,3,200);
  
  //add menu notifier block rows
  dashboard.insertRowsAfter(1,propServ.getProperty('INSTALL_NOTIFIER_LENGTH')-1);
  
  //format menu notifier cell
  var infoCell = dashboard.getRange('A1:A' + Math.floor(propServ.getProperty('INSTALL_NOTIFIER_LENGTH')));
  infoCell.merge();
}

function install_fillDashboard(dashboard){
  var propServ = PropertiesService.getScriptProperties();
  
  //add notifier text
  var readyCell = dashboard.getRange('A1');
  readyCell.setValue(propServ.getProperty('INSTALL_DASHBOARD_NOTIFER'));
  readyCell.setNote(propServ.getProperty('INSTALL_DASHBOARD_NOTIFIER_NOTE'));
  //format notifier text
  readyCell.setFontSize(25);
  readyCell.setFontWeight('bold');
  readyCell.setHorizontalAlignment('center');
  readyCell.setVerticalAlignment('middle');
  readyCell.setWrap(true);
  readyCell.setBackground('black');
  readyCell.setFontColor('white');
}

function install_installTriggers(container){
  //delete old triggers
  var oldTriggers = ScriptApp.getUserTriggers(container);
  for(var i = 0; i < oldTriggers.length; i++){
    ScriptApp.deleteTrigger(oldTriggers[i]);
  }
  //add new triggers
  ScriptApp.newTrigger('dashboard')
    .forSpreadsheet(container)
    .onOpen()
    .create();
}

function install_installLoaner(){
  genLoaner();
}

function install_forceUpdate(){
  //update loaner form with new title
  loaner_updateBookTitle();
  //update dashboard
  dashboard();
}