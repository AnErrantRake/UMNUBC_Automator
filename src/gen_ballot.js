function genBallot() {
  var suggestionFormURL = PropertiesService.getDocumentProperties().getProperty('suggestion_form_url');
  if(suggestionFormURL == null || !(suggestionFormURL.length > 0)){
    throw new Error("Ballot form generation requires a suggestion form");
    return;
  }
  
  //close old form
  var oldFormURL = PropertiesService.getDocumentProperties().getProperty('vote_form_url');
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
  
  Logger.log('Generating ballot');
  var form = formGenerator(getBallotTemplate());
  ballotGen_addQuestions(form);
  
  ballotGen_updateProperties(form);
  
  updateDashboard();
  
  // send results of generation to script user
  util_sendEmail(
      [],
      [],
      [Session.getActiveUser().getEmail()],
      'Ballot Generation Results',
      'Edit URL: ' + form.getEditUrl() + '\n\n' + ballotLog.join('\n')
    );
  
}

var ballotLog = ['Log for ballot creation:'];

function ballotGen_addQuestions(form){
  var items = suggestion_getResponseItems();
  Logger.log("Found items: " + items.length);
  
  //duplicates are handled on receipt
  for(var i = 0; i < items.length; i++){
    gen_addItem(items[i], form);
  }
}

function ballotGen_updateProperties(form){
  PropertiesService.getDocumentProperties().setProperty('vote_form_url', form.getEditUrl());
}

