function buildMenu() {
  var MENU_MAP = {
    'main' : {
      name: 'Automator',
      entries: [
        {name: 'Generate ballot form', functionName: 'genBallot'}, 
        {name: 'Generate suggestion form', functionName: 'genSuggestion'},
        null,
        {name: 'Add single ballot entry', functionName: 'vote_ballot_entry'},
        {name: 'Shuffle ballot entries', functionName: 'shuffle'},
        {name: 'Calculate vote winner', functionName: 'vote_calculation'},
        null,
        {name: 'Update loaner book title', functionName: 'loaner_manualUpdate'},
      ]
    },
    'advanced' : {
      name: 'Advanced',
      entries: [
        {name: 'Show Advanced Functions', functionName: 'advanced'}
      ]
    },
    'install' : {
      name: 'Automator Install',
      entries: [
        {name: 'Install', functionName: 'appInstall'},
      ]
    },
  }
        
  if(isInstalled()){
    SpreadsheetApp.getActive().addMenu(MENU_MAP['main'].name, MENU_MAP['main'].entries);
    SpreadsheetApp.getActive().addMenu(MENU_MAP['advanced'].name, MENU_MAP['advanced'].entries);
  } else {
    SpreadsheetApp.getActive().addMenu(MENU_MAP['install'].name, MENU_MAP['install'].entries);
    return false;
  }
}

function advanced(){
  var MENU_MAP = {
    'setup' : {
      name: 'Automator Setup',
      entries: [
        {name: 'Override Suggestion Form', functionName: 'overrideSuggestionForm'},
        {name: 'Update Suggestion Template', functionName: 'updateSuggestionTemplate'},
        null,
        {name: 'Override Vote Form', functionName: 'overrideVoteForm'},
        {name: 'Update Vote Template', functionName: 'updateVoteTemplate'},
        {name: 'Update Placeholder Image', functionName: 'updateVotePlaceholder'},
        null,
        {name: 'Update Loaner Template', functionName: 'updateLoanerTemplate'},
        {name: 'Generate Loaner Form', functionName: 'genLoaner'},
        null,
        {name: 'Force Update', functionName: 'forceUpdate'},
        {name: 'Reset Properties (requires reinstall)', functionName: 'propertyNuke'}, 
      ]
    }
  }
  SpreadsheetApp.getActive().removeMenu('Advanced');
  SpreadsheetApp.getActive().addMenu(MENU_MAP['setup'].name, MENU_MAP['setup'].entries);
}