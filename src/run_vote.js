function vote_getUpdate(){
  Logger.log("Updating vote data");
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('vote_count', 0);
  documentProperties.setProperty('vote_current_leader', 'undetermined');
}
