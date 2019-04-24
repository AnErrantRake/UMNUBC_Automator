function genSuggestion() {
  //close old form
  var oldFormURL = PropertiesService.getDocumentProperties().getProperty('suggestion_form_url');
  if(oldFormURL != null && oldFormURL.length > 0){
    try {
      var oldForm = FormApp.openByUrl(oldFormURL);
      oldForm.setAcceptingResponses(false);
    }
    catch(err){
      //do nothing, form doesn't exist
    }
  }

  Logger.log('Generating suggestion form');
  var form = util_formGen(getSuggestionTemplate());

  suggestionGen_updateProperties(form);

  dashboard();

}

function suggestionGen_updateProperties(form){
  PropertiesService.getDocumentProperties().setProperty('suggestion_form_url', form.getEditUrl());
}
