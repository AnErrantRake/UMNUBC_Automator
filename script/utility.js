var geval = eval; // global scope for eval
function includes(scriptURI){
  // base URL
  var link = 'https://raw.githubusercontent.com/AnErrantRake/UMNUBC_Automator/'

  // version/branch - defaults to master
  if( isInstalled() ) {
    link = link + getVersion() + '/';
  } else {
    link = link + 'dev/';
  }

  // add resource identifier
  link = link + scriptURI;

  // pull and eval
  geval(UrlFetchApp.fetch(link).getContentText());
}

function isInstalled(){
  if( PropertiesService.getScriptProperties().getProperty('AutomatorInstalled') ){
    return true;
  }
  return false;
}

function getVersion(){
  return PropertiesService.getScriptProperties().getProperty('version');
}

function setVersion(){
  var response = SpreadsheetApp.getUi().prompt("Set Automator Version",
                                      "Manually update the automator to use the specified version. Currently using version " + getVersion(),
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == SpreadsheetApp.getUi().Button.OK
      && response.getResponseText().length > 0){
    PropertiesService.getScriptProperties().setProperty('version', response.getResponseText());
  }
}

function propertyNuke(){
  PropertiesService.getDocumentProperties().deleteAllProperties();
  PropertiesService.getScriptProperties().deleteAllProperties();
  PropertiesService.getUserProperties().deleteAllProperties();
}
