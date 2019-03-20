function suggestion_getUpdate(){
  Logger.log("Updating suggestion data");
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('suggestion_response_count', 0);
}