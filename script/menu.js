function buildMenu(){
  var MENU_MAP = {
    'main' : {
      name: 'Automator',
      entries: [
        {name: 'Generate ballot form', functionName: 'genBallot'},
        {name: 'Generate suggestion form', functionName: 'genSuggestion'},
        {name: 'Calculate vote winner', functionName: 'calcVote'},
        {name: 'Update loaner book title', functionName: 'updateLoaner'},
      ]
        },
    'setup' : {
      name: 'Automator Setup',
      entries: [
        {name: 'Generate Loaner Form', functionName: 'genLoaner'},
        {name: 'Set Suggestion Form', functionName: 'setSuggestionForm'},
        {name: 'Set Vote Form', functionName: 'setVoteForm'},
        {name: 'Set Template Form', functionName: 'setTemplateForm'},
        {name: 'Set Automator Version', functionName: 'setVersion'},
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
