function configState(){
  util_guaranteeScriptsAvailable();
    
  if(! util_isInstalled()){
    return;
  }
  
  //prompt w/ details about to happen
  var response = util_Warning('CONFIG_WARNING_TITLE','CONFIG_WARNING_DESC');
  if(response == SpreadsheetApp.getUi().Button.NO){
    return;
  }
  
  var documentProperties = PropertiesService.getDocumentProperties();
  
  var options = ['template_form_url','suggestion_form_url','loaner_current_book'];
  for(var i = 0; i < options.length; i++){
    response = util_PublicPropertyPrompt(options[i]);
    if(response.getSelectedButton() == SpreadsheetApp.getUi().Button.CANCEL){
      return;
    }
    else if (response.getResponseText().length > 0){
      documentProperties.setProperty(options[i], response.getResponseText());
    }
  }
  
  //update loaner form with new title
  loaner_updateBookTitle();
  //update dashboard
  dashboard();
}

function configSecrets(){
  var privateProperties = PropertiesService.getUserProperties();
  
  var options = [];
  for(var i = 0; i < options.length; i++){
    var response = util_PrivatePropertyPrompt(options[i]);
    if(response.getSelectedButton() == SpreadsheetApp.getUi().Button.CANCEL){
      return;
    }
    else if (response.getResponseText().length > 0){
      privateProperties.setProperty(options[i], response.getResponseText());
    }
  }
}