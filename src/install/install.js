var Install = function(){
  includes('src/common/properties/document.js');
  includes('src/common/properties/script.js');
  includes('src/common/properties/user.js');

  this.container = SpreadsheetApp.getActive();
  this.dashboard = this.container.getActiveSheet();

  this.nuke = function(){
    // wipe properties
    PropertiesService.getDocumentProperties().deleteAllProperties();
    PropertiesService.getScriptProperties().deleteAllProperties();
    PropertiesService.getUserProperties().deleteAllProperties();

    // disconnect forms
    var form = container.getFormUrl();
    if(form != null){
      form.removeDestination();
    }

    // wipe sheet
    var sheetList = container.getSheets();
    this.dashboard = container.insertSheet();
    for(var i = 0; i < sheetList.length; i++){
      container.deleteSheet(sheetList[i]);
    }
    dashboard.setName('Dashboard');
    //remove all cells except 1
    dashboard.deleteColumns(1, dashboard.getMaxColumns()-1);
    dashboard.deleteRows(1, dashboard.getMaxRows()-1);

    // remove menu
    container.removeMenu('install');

    // remove old triggers
    var oldTriggers = ScriptApp.getUserTriggers(container);
    for(var i = 0; i < oldTriggers.length; i++){
      ScriptApp.deleteTrigger(oldTriggers[i]);
    }

    return this;
  }

  // builds all fields
  this.pave = function(){
    // add properties

    // add dashboard
    install_buildDashboard(container.getActiveSheet());
    dashboard.insertColumnsAfter(1,2);
    dashboard.setColumnWidths(1,3,200);
    //add menu notifier block rows
    dashboard.insertRowsAfter(1,propServ.getProperty('INSTALL_NOTIFIER_LENGTH')-1);
    //format menu notifier cell
    var infoCell = dashboard.getRange('A1:A' + Math.floor(propServ.getProperty('INSTALL_NOTIFIER_LENGTH')));
    infoCell.merge();

    // add menus


    PropertiesService.getDocumentProperties().setProperty('is_installed', true);

    return this;
  }

  // fills all fields
  this.init = function(){
    configState();
    configSecrets();

    genLoaner();
    // add triggers
    //add new triggers
    ScriptApp.newTrigger('dashboard')
      .forSpreadsheet(container)
      .onOpen()
      .create();

    return this;
  }
}
