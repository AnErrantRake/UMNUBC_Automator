function genLoaner() {
  var oldFormURL = PropertiesService.getDocumentProperties().getProperty('loaner_form_url'); 
  if(oldFormURL != null && oldFormURL.length > 0){    
    var response = util_Warning('GENERATOR_WARNING_TITLE','GENERATOR_WARNING_DESC');
    if(response == SpreadsheetApp.getUi().Button.NO){
      return;
    }
  }
  
  var form = formGenerator(getLoanerTemplate());
  
  loanerGen_installTriggers(form,oldFormURL);
  loanerGen_updateProperties(form);
  loaner_updateBookTitle();
  
  updateDashboard();
}

function loanerGen_installTriggers(form,oldFormURL){
  //remove old trigger(s)
  if(oldFormURL != null && oldFormURL.length > 0){
    try {
      var oldForm = FormApp.openByUrl(oldFormURL);
      var oldTriggers = ScriptApp.getUserTriggers(oldForm);
      for(var i = 0; i < oldTriggers.length; i++){
        ScriptApp.deleteTrigger(oldTriggers[i]);
      }
    }
    catch(err){
      //do nothing, form/triggers don't exist
    }
  }
  
  //add new trigger
  ScriptApp.newTrigger('loaner')
    .forForm(form)
    .onFormSubmit()
    .create();
}

function loanerGen_updateProperties(form){
  PropertiesService.getDocumentProperties().setProperty('loaner_form_url', form.getEditUrl());
}
