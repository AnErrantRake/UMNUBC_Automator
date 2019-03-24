function getDefaultScriptProperties(){
  return {
    INSTALL_WARNING_TITLE:'Installing the Automator is HIGHLY DESTRUCTIVE!',
    INSTALL_WARNING_DESC:'This process should only be conducted on a blank/template spreadsheet. It will delete ALL data in this spreadsheet, all triggers and unlink all forms. Are you sure you want to continue?',
    INSTALL_DASHBOARD_NOTIFER:'Use the \'Automator\' menu to access script functions',
    INSTALL_DASHBOARD_NOTIFIER_NOTE:'You may need to refresh for the menu to appear.',
    INSTALL_INSTALLED_PROPERTY_KEY:'IS_INSTALLED',
    INSTALL_NOTIFIER_LENGTH: 12,
    
    OUTOFORDER_TITLE:'Automator has not been installed!',
    OUTOFORDER_DESC:'The automator must be installed on this spreadsheet before running the config or any other commands.',
    
    CONFIG_WARNING_TITLE:'This is a manual OVERRIDE!',
    CONFIG_WARNING_DESC:'Using this option is not recommended outside of the initial setup. The automator keeps these properties updated as it gets used. Only use this option if you understand the changes you\'re making. \n\n Are you sure you want to continue?',
    
    LOANERGEN_WARNING_TITLE:'A loaner form already exists!',
    LOANERGEN_WARNING_DESC:'There is already a loaner form configured in the automator. Continuing will replace that form with a new form. Any previous responses will not be transferred. Perhaps you meant "Update Loaner Form". \n\nAre you sure you want to continue?',
    
    ERROR_CONTAINER_BOUND:'Script is not container-bound. Project needs to be bound to an active spreadsheet!',
    ERROR_NOT_INSTALLED:'Automator has not been installed!',
    
    DASHBOARD_SHEETNAME:'Dashboard',
    
    //descriptions for public properties - property name + '_desc'
    is_installed_desc:'Whether or not the automator has been successfully installed.',
    vote_form_url_desc:'Direct link to edit version of the current ballot form.',
    vote_count_desc:'Count of responses on ballot form.',
    vote_current_leader_desc:'Title and author of current vote leader.',
    suggestion_form_url_desc:'Direct link to edit version of the current suggestions form.',
    suggestion_response_count_desc:'Count of responses on suggestion form.',
    loaner_form_url_desc:'Direct link to edit version of the book loaner form.',
    loaner_current_book_desc:'Title of this month\'s current book. Used for loaner form automation.',
    loaner_have_count_desc:'Count of loaner form users indicating willingness to loan this month\'s book. This is the total number, not the amount remaining.',
    loaner_need_count_desc:'Count of loaner form users indicating need to acquire this month\'s book. This is the total number, not the amount remaining.',
    loaner_matches_count_desc:'Count of matches between loaner form users for this month\'s book.',
    template_form_url_desc:'Direct link to edit version of the form used as template for all other forms.',
    
    //descriptions for private properties - property name + '_desc'
    
  };
}

function resetScriptProperties(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var properties = getDefaultScriptProperties();
  
  scriptProperties.setProperties(properties, true);
}