function formGenerator(template){
  var templateURL;
  switch(template.metadata.type){
    case 'suggestion':
      templateURL = PropertiesService.getDocumentProperties().getProperty('suggestion_template_form_url');
      if(templateURL == null || !(templateURL.length > 0)){
        templateURL = util_friendlyPropertyUpdate('suggestion_template_form_url');
      }
      break;
    case 'ballot':
      templateURL = PropertiesService.getDocumentProperties().getProperty('vote_template_form_url');
      if(templateURL == null || !(templateURL.length > 0)){
        templateURL = util_friendlyPropertyUpdate('vote_template_form_url');
      }
      var placeholderURL = PropertiesService.getDocumentProperties().getProperty('vote_template_form_url');
      if(placeholderURL == null || !(placeholderURL.length > 0)){
        placeholderURL = util_friendlyPropertyUpdate('vote_template_form_url');
      }
      break;
    case 'loaner':
      templateURL = PropertiesService.getDocumentProperties().getProperty('loaner_template_form_url');
      if(templateURL == null || !(templateURL.length > 0)){
        templateURL = util_friendlyPropertyUpdate('loaner_template_form_url');
      }
      break;
    default:
      Logger.log('Unknown form type!');
      break;
  }
  
  //get form and update main header
  if(templateURL != null && templateURL.length > 0){
    var templateForm = FormApp.openByUrl(templateURL);
    var formID = DriveApp.getFileById(templateForm.getId()).makeCopy().setName(template.header.title).getId();
    var form = FormApp.openById(formID); //gross - probably a better way to cast
    
    form.setTitle(template.header.title);
    form.deleteAllResponses();
    var items = form.getItems();
    for(var i = 0; i < items.length; i++){
      form.deleteItem(items[i]);
    }
  }
  else{
    var form = FormApp.create(template.header.title);
  }
  form.setDescription(template.header.desc);
  
  //sections and items
  for(var section in template.sections){
    for(var item in template.sections[section].items){
      //create item
      gen_addItem(template.sections[section].items[item], form);
    }
  }
  
  //options
  gen_addOptions(template.options,form);
  
  return form;
}



function gen_addOptions(options,form){
  form.setRequireLogin(options.requireLogin);
  form.setCollectEmail(options.collectEmail);
  form.setAllowResponseEdits(options.allowResponseEdits);
  form.setConfirmationMessage(options.confirmationMessage);
  form.setIsQuiz(options.isQuiz);
  form.setLimitOneResponsePerUser(options.limitOneResponsePerUser);
  form.setProgressBar(options.progressBar);
  form.setPublishingSummary(options.publishingSummary);
  form.setShowLinkToRespondAgain(options.showLinkToRespondAgain);
  form.setShuffleQuestions(options.shuffleQuestions);
}

function gen_addItem(item,form){
  Logger.log('Adding item ' + item.type);
  switch(item.type){
        case FormApp.ItemType.CHECKBOX:
          return gen_addItem_Checkbox(item,form);
        case FormApp.ItemType.CHECKBOX_GRID:
          return gen_addItem_checkboxGrid(item,form);
        case FormApp.ItemType.DATE:
          return gen_addItem_date(item,form);
        case FormApp.ItemType.DATETIME:
          return gen_addItem_dateTime(item,form);
        case FormApp.ItemType.DURATION:
          return gen_addItem_duration(item,form);
        case FormApp.ItemType.GRID:
          return gen_addItem_grid(item,form);
        case FormApp.ItemType.IMAGE:
          return gen_addItem_image(item,form);
        case FormApp.ItemType.LIST:
          return gen_addItem_list(item,form);
        case FormApp.ItemType.MULTIPLE_CHOICE:
          return gen_addItem_multiChoice(item,form);
        case FormApp.ItemType.PAGE_BREAK:
          return gen_addItem_pageBreak(item,form);
        case FormApp.ItemType.PARAGRAPH_TEXT:
          return gen_addItem_paragraphText(item,form);
        case FormApp.ItemType.SCALE:
          return gen_addItem_scale(item,form);
        case FormApp.ItemType.SECTION_HEADER:
          return gen_addItem_sectionHeader(item,form);
        case FormApp.ItemType.TEXT:
          return gen_addItem_text(item,form);
        case FormApp.ItemType.TIME:
          return gen_addItem_time(item,form);
        case FormApp.ItemType.VIDEO:
          return gen_addItem_Video(item,form);
        default: 
          break;
  }
}


function gen_updateItem(existing, update){
  Logger.log('Updating item ' + existing.getType());
  if(existing.getType() !== update.type){
    Logger.log('Type mismatch: ' + existing.getType() + '!==' + update.type);
    return;
  }
  switch(existing.getType()){
        case FormApp.ItemType.CHECKBOX:
          return gen_updateItem_Checkbox(existing, update);
        case FormApp.ItemType.CHECKBOX_GRID:
          return gen_updateItem_checkboxGrid(existing, update);
        case FormApp.ItemType.DATE:
          return gen_updateItem_date(existing, update);
        case FormApp.ItemType.DATETIME:
          return gen_updateItem_dateTime(existing, update);
        case FormApp.ItemType.DURATION:
          return gen_updateItem_duration(existing, update);
        case FormApp.ItemType.GRID:
          return gen_updateItem_grid(existing, update);
        case FormApp.ItemType.IMAGE:
          return gen_updateItem_image(existing, update);
        case FormApp.ItemType.LIST:
          return gen_updateItem_list(existing, update);
        case FormApp.ItemType.MULTIPLE_CHOICE:
          return gen_updateItem_multiChoice(existing, update);
        case FormApp.ItemType.PAGE_BREAK:
          return gen_updateItem_pageBreak(existing, update);
        case FormApp.ItemType.PARAGRAPH_TEXT:
          return gen_updateItem_paragraphText(existing, update);
        case FormApp.ItemType.SCALE:
          return gen_updateItem_scale(existing, update);
        case FormApp.ItemType.SECTION_HEADER:
          return gen_updateItem_sectionHeader(existing, update);
        case FormApp.ItemType.TEXT:
          return gen_updateItem_text(existing, update);
        case FormApp.ItemType.TIME:
          return gen_updateItem_time(existing, update);
        case FormApp.ItemType.VIDEO:
          return gen_updateItem_Video(existing, update);
        default: 
          break;
  }
}

function gen_addItem_Checkbox(item,form) {
  Logger.log("Adding CheckboxItem to Form");
}
function gen_updateItem_Checkbox(existing, update) {
  Logger.log("Updating CheckboxItem to Form");
}

function gen_addItem_checkboxGrid(item,form) {
  Logger.log("Adding CheckboxGridItem to Form");
}
function gen_updateItem_checkboxGrid(existing, update) {
  Logger.log("Updating CheckboxGridItem to Form");
}

function gen_addItem_date(item,form) {
  Logger.log("Adding DateItem to Form");
}
function gen_updateItem_date(existing, update) {
  Logger.log("Updating DateItem to Form");
}

function gen_addItem_dateTime(item,form) {
  Logger.log("Adding DateTimeItem to Form");
}
function gen_updateItem_dateTime(existing, update) {
  Logger.log("Updating DateTimeItem to Form");
}

function gen_addItem_duration(item,form) {
  Logger.log("Adding DurationItem to Form");
}
function gen_updateItem_duration(existing, update) {
  Logger.log("Updating DurationItem to Form");
}

function gen_addItem_grid(item,form) {
  Logger.log("Adding GridItem to Form");
}
function gen_updateItem_grid(existing, update) {
  Logger.log("Updating GridItem to Form");
}

function gen_addItem_image(item,form) {
  Logger.log("Adding ImageItem to Form");
  return form.addImageItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setImage(item.image) //order matters - image before alignment/width
    .setAlignment(item.options.alignment)
    .setWidth(item.options.width)
  ;
}
function gen_updateItem_image(existing, update) {
  Logger.log("Updating ImageItem to Form");
  return existing.asImageItem()
    .setTitle(update.header.title)
    .setHelpText(update.header.desc)
    .setImage(update.image) //order matters - image before alignment/width
    .setAlignment(update.options.alignment)
    .setWidth(update.options.width)
  ;
}

function gen_addItem_list(item,form) {
  Logger.log("Adding ListItem to Form");
  return form.addListItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setRequired(item.options.required)
    .setChoiceValues(item.choices)
  ;
}
function gen_updateItem_list(existing, update) {
  Logger.log("Updating ListItem to Form");
  return existing.asListItem()
    .setTitle(update.header.title)
    .setHelpText(update.header.desc)
    .setRequired(update.options.required)
    .setChoiceValues(update.choices)
  ;
}

function gen_addItem_multiChoice(item,form) {
  Logger.log("Adding MultiChoiceItem to Form");
}
function gen_updateItem_multiChoice(existing, update) {
  Logger.log("Updating MultiChoiceItem to Form");
}

function gen_addItem_pageBreak(item,form) {
  Logger.log("Adding PageBreakItem to Form");
  return form.addPageBreakItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setGoToPage(item.navigation)
  ;
}
function gen_updateItem_pageBreak(existing, update) {
  Logger.log("Updating PageBreakItem to Form");
  return existing.asPageBreakItem()
    .setTitle(update.header.title)
    .setHelpText(update.header.desc)
    .setGoToPage(update.navigation)
  ;
}

function gen_addItem_paragraphText(item,form) {
  Logger.log("Adding ParagraphTextItem to Form");
  return form.addParagraphTextItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setRequired(item.options.required)
  ;
}
function gen_updateItem_paragraphText(existing, update) {
  Logger.log("Updating ParagraphTextItem to Form");
  return existing.asParagraphTextItem()
    .setTitle(update.header.title)
    .setHelpText(update.header.desc)
    .setRequired(update.options.required)
  ;
}

function gen_addItem_scale(item,form) {
  Logger.log("Adding ScaleItem to Form");
  return form.addScaleItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setBounds(item.bounds[0], item.bounds[1])
    .setLabels(item.labels[0], item.labels[1])
    .setRequired(item.options.required)
  ;
}
function gen_updateItem_scale(existing, update) {
  Logger.log("Updating ScaleItem to Form");
  return existing.asScaleItem()
    .setTitle(update.header.title)
    .setHelpText(update.header.desc)
    .setBounds(update.bounds[0], update.bounds[1])
    .setLabels(update.labels[0], update.labels[1])
    .setRequired(update.options.required)
  ;
}

function gen_addItem_sectionHeader(item,form) {
  Logger.log("Adding SectionHeaderItem to Form");
  return form.addSectionHeaderItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
  ;
}
function gen_updateItem_sectionHeader(existing, update) {
  Logger.log("Updating SectionHeaderItem to Form");
  return existing.asSectionHeaderItem()
    .setTitle(update.header.title)
    .setHelpText(update.header.desc)
  ;
}

function gen_addItem_text(item,form) {
  Logger.log("Adding TextItem to Form");
  return form.addTextItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setRequired(item.options.required)
  ;
}
function gen_updateItem_text(existing, update) {
  Logger.log("Updating TextItem to Form");
  return existing.asTextItem()
    .setTitle(update.header.title)
    .setHelpText(update.header.desc)
    .setRequired(update.options.required)
  ;
}

function gen_addItem_time(item,form) {
  Logger.log("Adding TimeItem to Form");
}
function gen_updateItem_time(existing, update) {
  Logger.log("Updating TimeItem to Form");
}

function gen_addItem_Video(item,form) {
  Logger.log("Adding VideoItem to Form");
}
function gen_updateItem_Video(existing, update) {
  Logger.log("Updating VideoItem to Form");
}