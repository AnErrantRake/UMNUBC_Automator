function isInstalled(){
  if( PropertiesService.getDocumentProperties().getProperty('AutomatorInstalled') ){
    return true;
  }
  return false;
}

function getVersion(){
  return PropertiesService.getScriptProperties().getProperty('version');
}

function includes(scriptURI){
  // base URL
  var link = 'https://raw.githubusercontent.com/AnErrantRake/UMNUBC_Automator/'

  // version/branch - defaults to master
  if( isInstalled() ) {
    link = link + getVersion() + '/';
  } else {
    link = link + 'master/';
  }

  // add resource identifier
  link = link + scriptURI;

  // pull and eval
  eval(UrlFetchApp.fetch(link).getContentText());
}
