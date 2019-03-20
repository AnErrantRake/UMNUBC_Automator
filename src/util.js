function util_getContainerSpreadsheet(){
  var database = SpreadsheetApp.getActive();
  if(database == null){
    throw new Error(ERROR_CONTAINER_BOUND);
  }
  return database;
}

function util_isInstalled(){
  var scriptProperties = PropertiesService.getScriptProperties();
  
  if( ! PropertiesService.getDocumentProperties().getProperty('is_installed') ){
    SpreadsheetApp.getUi().alert(
      scriptProperties.getProperty('OUTOFORDER_TITLE'), 
      scriptProperties.getProperty('OUTOFORDER_DESC'), 
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    throw new Error(scriptProperties.getProperty('ERROR_NOT_INSTALLED'));
    return false;
  }
  return true;
}

function util_formGen(template){
  //header
  var form = FormApp.create(template.header.title);
  form.setDescription(template.header.desc);
  //sections
  
  for(var section in template.sections){
    for(var item in template.sections[section].items){
      //create item
      gen_addItem(template.sections[section].items[item], form);
    }
  }
  
  //options
  form.setRequireLogin(template.options.requireLogin);
  form.setCollectEmail(template.options.collectEmail);
  
  //metadata
  
  
  return form;
}


function util_Warning(title,desc){
  var scriptProperties = PropertiesService.getScriptProperties();
  
  return SpreadsheetApp.getUi().alert(scriptProperties.getProperty(title), 
                                      scriptProperties.getProperty(desc), 
                                      SpreadsheetApp.getUi().ButtonSet.YES_NO);
}


function util_PublicPropertyPrompt(key){
  var documentProperties = PropertiesService.getDocumentProperties();
  var scriptProperties = PropertiesService.getScriptProperties();
  
  var desc = scriptProperties.getProperty(key+'_desc');         //description
  desc += '\n\nCurrent:' + documentProperties.getProperty(key); //current value
  desc += '\n\nLeave blank to make no changes. Press OK to continue. Press Cancel to quit without making changes.' //instructions
  return SpreadsheetApp.getUi().prompt(key, 
                                      desc, 
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
}

function util_PrivatePropertyPrompt(key){
  var scriptProperties = PropertiesService.getScriptProperties();
  
  var desc = scriptProperties.getProperty(key+'_desc');
  return SpreadsheetApp.getUi().prompt(key, 
                                      desc, 
                                      SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
}
