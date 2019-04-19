function buildMenu(){
  var MENU_MAP = {
    'main' : {
      name: 'Automator',
      entries: [
        {name: 'Generate ballot form', functionName: 'genBallot'},
        {name: 'Generate suggestion form', functionName: 'genSuggestion'},
        {name: 'Calculate vote winner', functionName: 'vote_calculation'},
        {name: 'Update loaner book title', functionName: 'loaner_manualUpdate'},
      ]
        },
    'setup' : {
      name: 'Automator Setup',
      entries: [
        {name: 'Configure Automator', functionName: 'configState'},
        {name: 'Force Update', functionName: 'install_forceUpdate'},
        {name: 'Generate Loaner Form', functionName: 'genLoaner'},
      ]
    },
    'install' : {
      name: 'Automator Install',
      entries: [
        {name: 'Install', functionName: 'appInstall'},
      ]
    },
  }

  if( isInstalled() ) {
    SpreadsheetApp.getActive().addMenu(MENU_MAP['main'].name, MENU_MAP['main'].entries);
    SpreadsheetApp.getActive().addMenu(MENU_MAP['setup'].name, MENU_MAP['setup'].entries);
  } else {
    SpreadsheetApp.getActive().addMenu(MENU_MAP['install'].name, MENU_MAP['install'].entries);
    return false;
  }
  return true;
}
