function genBallot() {
  util_guaranteeScriptsAvailable();
  
  //close old form
  var oldFormURL = PropertiesService.getDocumentProperties().getProperty('vote_form_url');
  if(oldFormURL != null && oldFormURL.length > 0){
    try {
      var oldForm = FormApp.openByUrl(oldFormURL);
      oldForm.setAcceptingResponses(false);
    }
    catch(err){
      //do nothing, form doesn't exist
    }
  }
  
  Logger.log('Generating ballot');
  var form = util_formGen(getBallotTemplate());
  
  ballotGen_addQuestions(form);
  
  ballotGen_updateProperties(form);
  
  dashboard();
  
}

function ballotGen_addQuestions(form){
  var items = suggestion_getResponseItems();
  Logger.log("Found items: " + items.length);
  for(var i = 0; i < items.length; i++){
    gen_addItem(items[i], form);
  }
}

function ballotGen_updateProperties(form){
  PropertiesService.getDocumentProperties().setProperty('vote_form_url', form.getEditUrl());
}

