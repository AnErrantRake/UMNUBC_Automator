function vote_getUpdate(){
  util_guaranteeScriptsAvailable();
  Logger.log("Updating vote data");
  var documentProperties = PropertiesService.getDocumentProperties();
  var responseCount = 0;
  var currentLeader = 'undetermined';
    
  var ballotURL = documentProperties.getProperty('suggestion_form_url');
  if(ballotURL != null && ballotURL.length > 0){
    var form = FormApp.openByUrl(ballotURL);
    responseCount = form.getResponses().length;
    currentLeader = vote_getWinner(form);
  }
  
  documentProperties.setProperty('vote_count', responseCount);
  documentProperties.setProperty('vote_current_leader', currentLeader);
}

function vote_getWinner(form){
  return 'not implemented';
}