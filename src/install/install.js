var Install = function(){
  includes('src/common/properties/document.js');
  includes('src/common/properties/script.js');
  includes('src/common/properties/user.js');
  includes('src/ui/dashboard.js');

  this.container = SpreadsheetApp.getActive();
  this.dashboard = this.container.getActiveSheet();

  this.nuke = function(){
    // wipe properties
    PropertiesService.getDocumentProperties().deleteAllProperties();
    PropertiesService.getScriptProperties().deleteAllProperties();
    PropertiesService.getUserProperties().deleteAllProperties();

    // disconnect forms
    var form = this.container.getFormUrl();
    if(form != null){
      form.removeDestination();
    }

    // wipe sheet
    var sheetList = this.container.getSheets();
    this.dashboard = this.container.insertSheet();
    for(var i = 0; i < sheetList.length; i++){
      this.container.deleteSheet(sheetList[i]);
    }
    this.dashboard.setName('Dashboard');
    //remove all cells except 1
    this.dashboard.deleteColumns(1, this.dashboard.getMaxColumns()-1);
    this.dashboard.deleteRows(1, this.dashboard.getMaxRows()-1);

    // remove menu
    this.container.removeMenu('Install');

    // remove old triggers
    var oldTriggers = ScriptApp.getUserTriggers(this.container);
    for(var i = 0; i < oldTriggers.length; i++){
      ScriptApp.deleteTrigger(oldTriggers[i]);
    }

    return this;
  }

  // builds all fields
  this.pave = function(){
    // add properties
    resetDocumentProperties();
    resetScriptProperties();
    resetUserProperties();
    PropertiesService.getDocumentProperties().setProperty('AutomatorInstalled', true);

    // add dashboard
    this.dashboard.insertColumnsAfter(1,2);
    this.dashboard.setColumnWidths(1,3,200);
    //add menu notifier block rows
    this.dashboard.insertRowsAfter(1,
      PropertiesService.getScriptProperties().getProperty('INSTALL_NOTIFIER_LENGTH')-1);
    //format menu notifier cell
    var infoCell = this.dashboard.getRange('A1:A' + Math.floor(
      PropertiesService.getScriptProperties().getProperty('INSTALL_NOTIFIER_LENGTH'))
    );
    infoCell.merge();

    // add menus
    buildMenu();

    return this;
  }

  // fills all fields
  this.init = function(){
    // notifier
    var readyCell = this.dashboard.getRange('A1');
    readyCell.setValue(PropertiesService.getScriptProperties().getProperty('INSTALL_DASHBOARD_NOTIFER'));
    readyCell.setNote(PropertiesService.getScriptProperties().getProperty('INSTALL_DASHBOARD_NOTIFIER_NOTE'));
    //format notifier text
    readyCell.setFontSize(25);
    readyCell.setFontWeight('bold');
    readyCell.setHorizontalAlignment('center');
    readyCell.setVerticalAlignment('middle');
    readyCell.setWrap(true);
    readyCell.setBackground('black');
    readyCell.setFontColor('white');

    // dashboard fields
    updateDashboard();

    return this;
  }
}
