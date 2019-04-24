function genLoaner(){
    includes('src/install/install.js');
    var runtime = new Install();
    runtime.nuke();
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


function getSuggestionForm(){
  return PropertiesService.getScriptProperties().getProperty('suggestion_form_url');
}

function setSuggestionForm(){
  var response = SpreadsheetApp.getUi().prompt("Set Suggestion Form",
                                      "Manually update the automator to use the specified suggestion form. Currently using " + getSuggestionForm(),
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == SpreadsheetApp.getUi().Button.OK
      && response.getResponseText().length > 0){
    PropertiesService.getScriptProperties().setProperty('suggestion_form_url', response.getResponseText());
  }
}


function getVoteForm(){
  return PropertiesService.getScriptProperties().getProperty('vote_form_url');
}

function setVoteForm(){
  var response = SpreadsheetApp.getUi().prompt("Set Vote Form",
                                      "Manually update the automator to use the specified voting form. Currently using " + getVoteForm(),
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == SpreadsheetApp.getUi().Button.OK
      && response.getResponseText().length > 0){
    PropertiesService.getScriptProperties().setProperty('vote_form_url', response.getResponseText());
  }
}


function getTemplateForm(){
  return PropertiesService.getScriptProperties().getProperty('template_form_url');
}

function setTemplateForm(){
  var response = SpreadsheetApp.getUi().prompt("Set Template Form",
                                      "Manually update the automator to use the specified voting form. Currently using " + getTemplateForm(),
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == SpreadsheetApp.getUi().Button.OK
      && response.getResponseText().length > 0){
    PropertiesService.getScriptProperties().setProperty('template_form_url', response.getResponseText());
  }
}
