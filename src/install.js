//some redundancies here - room for optimization
function appInstall(){
  var runtime = new Install();
  
  var warning = SpreadsheetApp.getUi().alert(runtime.warning.title, 
                                      runtime.warning.desc, 
                                      SpreadsheetApp.getUi().ButtonSet.YES_NO);
  if(warning == SpreadsheetApp.getUi().Button.NO) {
    throw new Error('Chose not to install');
    return;
  }
  
  runtime.nuke().pave().init();
  genLoaner();
}

var Install = function(){
  this.container = SpreadsheetApp.getActive();
  this.dashboard = this.container.getActiveSheet();
  this.notifier_length = 12;
  this.warning = {title: 'Installing the Automator is HIGHLY DESTRUCTIVE!',
                  desc: 'This process should only be conducted on a blank/template spreadsheet. It will delete ALL data in this spreadsheet, all triggers and unlink all forms. Are you sure you want to continue?',
                 };
  this.dashboardInfo = {text: 'Use the \'Automator\' menu to access script functions',
                    note: 'You may need to refresh for the menu to appear.',
                   };
      
  this.nuke = function(){
    // wipe properties
    propertyNuke();

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

    // remove old triggers
    var oldTriggers = ScriptApp.getUserTriggers(this.container);
    for(var i = 0; i < oldTriggers.length; i++){
      ScriptApp.deleteTrigger(oldTriggers[i]);
    }

    // remove menu
    this.container.removeMenu('Automator Install');

    return this;
  }

  // builds all fields
  this.pave = function(){
    // add properties
    resetDocumentProperties();
    resetScriptProperties();
    resetUserProperties();
    PropertiesService.getScriptProperties().setProperty('AutomatorInstalled', true);

    // add dashboard
    this.dashboard.insertColumnsAfter(1,2);
    this.dashboard.setColumnWidths(1,3,200);
    //add menu notifier block rows
    this.dashboard.insertRowsAfter(1,this.notifier_length-1);
    //format menu notifier cell
    var infoCell = this.dashboard.getRange('A1:A' + Math.floor(this.notifier_length)
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
    readyCell.setValue(this.dashboardInfo.text);
    readyCell.setNote(this.dashboardInfo.note);
    //format notifier text
    readyCell.setFontSize(25);
    readyCell.setFontWeight('bold');
    readyCell.setHorizontalAlignment('center');
    readyCell.setVerticalAlignment('middle');
    readyCell.setWrap(true);
    readyCell.setBackground('black');
    readyCell.setFontColor('white');

    // install triggers
    ScriptApp.newTrigger('updateDashboard')
      .forSpreadsheet(this.container)
      .onOpen()
      .create();

    // refresh UI
    updateDashboard();

    return this;
  }
}
