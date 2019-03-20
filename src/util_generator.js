
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

function gen_addItem_Checkbox(item,form) {}
function gen_addItem_checkboxGrid(item,form) {}
function gen_addItem_date(item,form) {}
function gen_addItem_dateTime(item,form) {}
function gen_addItem_duration(item,form) {}
function gen_addItem_grid(item,form) {}
function gen_addItem_image(item,form) {}
function gen_addItem_list(item,form) {
  var listItem = form.addListItem();
  listItem.setTitle(item.header.title);
  listItem.setHelpText(item.header.desc);
  listItem.setRequired(item.options.required);
  listItem.setChoiceValues(item.choices);
}
function gen_addItem_multiChoice(item,form) {}
function gen_addItem_pageBreak(item,form) {}
function gen_addItem_paragraphText(item,form) {}
function gen_addItem_scale(item,form) {}
function gen_addItem_sectionHeader(item,form) {}
function gen_addItem_text(item,form) {}
function gen_addItem_time(item,form) {}
function gen_addItem_Video(item,form) {}