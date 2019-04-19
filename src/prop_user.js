function getDefaultUserProperties(){
    return {
      userreadabletitle:'value',
      userreadabletitle_desc:'description of above value',
  };
}

function resetUserProperties(){
  var userProperties = PropertiesService.getUserProperties();
  var properties = getDefaultUserProperties();

  userProperties.setProperties(properties, true);
}