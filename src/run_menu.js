function onOpen(e) {
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
        {name: 'Update Secrets', functionName: 'configSecrets'},
        {name: 'Force Update', functionName: 'install_forceUpdate'},
        {name: 'Generate Loaner Form', functionName: 'genLoaner'}, 
        {name: 'Install Automator', functionName: 'install'}, 
      ]
    }
  }
  
  SpreadsheetApp.getActive().addMenu(MENU_MAP['main'].name, MENU_MAP['main'].entries);
  SpreadsheetApp.getActive().addMenu(MENU_MAP['setup'].name, MENU_MAP['setup'].entries);
}
