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
  if( PropertiesService.getDocumentProperties().getProperty('AutomatorInstalled') ){
    return true;
  }
  return false;
}

function getVersion(){
  return PropertiesService.getScriptProperties().getProperty('version');
}

function propertyNuke(){
  PropertiesService.getDocumentProperties().deleteAllProperties();
  PropertiesService.getScriptProperties().deleteAllProperties();
  PropertiesService.getUserProperties().deleteAllProperties();
}
