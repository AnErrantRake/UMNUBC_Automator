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
  switch(item.type){
        case FormApp.ItemType.CHECKBOX:
          gen_addItem_Checkbox(item,form);
          break;
        case FormApp.ItemType.CHECKBOX_GRID:
          gen_addItem_checkboxGrid(item,form);
          break;
        case FormApp.ItemType.DATE:
          gen_addItem_date(item,form);
          break;
        case FormApp.ItemType.DATETIME:
          gen_addItem_dateTime(item,form);
          break;
        case FormApp.ItemType.DURATION:
          gen_addItem_duration(item,form);
          break;
        case FormApp.ItemType.GRID:
          gen_addItem_grid(item,form);
          break;
        case FormApp.ItemType.IMAGE:
          gen_addItem_image(item,form);
          break;
        case FormApp.ItemType.LIST:
          gen_addItem_list(item,form);
          break;
        case FormApp.ItemType.MULTIPLE_CHOICE:
          gen_addItem_multiChoice(item,form);
          break;
        case FormApp.ItemType.PAGE_BREAK:
          gen_addItem_pageBreak(item,form);
          break;
        case FormApp.ItemType.PARAGRAPH_TEXT:
          gen_addItem_paragraphText(item,form);
          break;
        case FormApp.ItemType.SCALE:
          gen_addItem_scale(item,form);
          break;
        case FormApp.ItemType.SECTION_HEADER:
          gen_addItem_sectionHeader(item,form);
          break;
        case FormApp.ItemType.TEXT:
          gen_addItem_text(item,form);
          break;
        case FormApp.ItemType.TIME:
          gen_addItem_time(item,form);
          break;
        case FormApp.ItemType.VIDEO:
          gen_addItem_Video(item,form);
          break;
        default: 
          break;
  }
}

function gen_addItem_Checkbox(item,form) {
  Logger.log("Adding CheckboxItem to Form");
}
function gen_addItem_checkboxGrid(item,form) {
  Logger.log("Adding CheckboxGridItem to Form");
}
function gen_addItem_date(item,form) {
  Logger.log("Adding DateItem to Form");
}
function gen_addItem_dateTime(item,form) {
  Logger.log("Adding DateTimeItem to Form");
}
function gen_addItem_duration(item,form) {
  Logger.log("Adding DurationItem to Form");
}
function gen_addItem_grid(item,form) {
  Logger.log("Adding GridItem to Form");
}
function gen_addItem_image(item,form) {
  Logger.log("Adding ImageItem to Form");
  form.addImageItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setImage(item.image) //order matters - image before alignment/width
    .setAlignment(item.options.alignment)
    .setWidth(item.options.width)
  ;
}
function gen_addItem_list(item,form) {
  Logger.log("Adding ListItem to Form");
  form.addListItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setRequired(item.options.required)
    .setChoiceValues(item.choices)
  ;
}
function gen_addItem_multiChoice(item,form) {
  Logger.log("Adding MultiChoiceItem to Form");
}
function gen_addItem_pageBreak(item,form) {
  Logger.log("Adding PageBreakItem to Form");
  form.addPageBreakItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setGoToPage(item.navigation)
  ;
}
function gen_addItem_paragraphText(item,form) {
  Logger.log("Adding ParagraphTextItem to Form");
  form.addParagraphTextItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setRequired(item.options.required)
  ;
}
function gen_addItem_scale(item,form) {
  Logger.log("Adding ScaleItem to Form");
  form.addScaleItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setBounds(item.bounds[0], item.bounds[1])
    .setLabels(item.labels[0], item.labels[1])
    .setRequired(item.options.required)
  ;
}
function gen_addItem_sectionHeader(item,form) {
  Logger.log("Adding SectionHeaderItem to Form");
  form.addSectionHeaderItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
  ;
}
function gen_addItem_text(item,form) {
  Logger.log("Adding TextItem to Form");
  form.addTextItem()
    .setTitle(item.header.title)
    .setHelpText(item.header.desc)
    .setRequired(item.options.required)
  ;
}
function gen_addItem_time(item,form) {
  Logger.log("Adding TimeItem to Form");
}
function gen_addItem_Video(item,form) {
  Logger.log("Adding VideoItem to Form");
}