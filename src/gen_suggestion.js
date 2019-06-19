function genSuggestion() {
  //close old form
  var oldFormURL = PropertiesService.getDocumentProperties().getProperty('suggestion_form_url');
  if(oldFormURL != null && oldFormURL.length > 0){
    
    var response = util_Warning('GENERATOR_WARNING_TITLE','GENERATOR_WARNING_DESC');
    if(response == SpreadsheetApp.getUi().Button.NO){
      return;
    }
    
    try {
      var oldForm = FormApp.openByUrl(oldFormURL);
      oldForm.setAcceptingResponses(false);
    }
    catch(err){
      //do nothing, form doesn't exist
    }
  }
  
  Logger.log('Generating suggestion form');
  var form = formGenerator(getSuggestionTemplate());
  
  suggestionGen_updateProperties(form);
  
  updateDashboard();
  
}

function suggestionGen_updateProperties(form){
  PropertiesService.getDocumentProperties().setProperty('suggestion_form_url', form.getEditUrl());
}
