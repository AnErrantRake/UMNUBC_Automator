function getDefaultScriptProperties(){
  return {    
    AutomatorInstalled: false,
    AutomatorInstalled_desc:'Whether or not the automator has been successfully installed.',

    VOTE_CALC_TIE_TITLE:'The vote resulted in a tie!',
    VOTE_CALC_TIE_DESC:'The tied books were:\n',
    VOTE_CALC_WINNER_TITLE:'We have a winner!',
    VOTE_CALC_WINNER_DESC:'The winner is:\n',
    
    GENERATOR_WARNING_TITLE:'A form of this type already exists!',
    GENERATOR_WARNING_DESC:'There is already a form configured in the automator. Continuing will replace that form with a new form. Any previous responses will not be transferred.\n\nAre you sure you want to continue?',
    
    FRIENDLY_UPDATE_TITLE:'Property has not been set!',
    FRIENDLY_UPDATE_DESC:'is an optional property, but you can set it now before the script uses the default.',
    
    LOANER_EMAIL_SUCCESS_SUBJECT:'UMNUBC Loan Automator - Match for ',
    LOANER_EMAIL_SUCCESS_BODY:'Our extremely advanced algorithm has identified a potential match!\nOne of you (see CC) has an available book, and the other would like to make use of that book.\nPlease reach out to each other to arrange the terms and conditions of your book loan.\n\n\nThank you for using the Loan Automator, brought to you by UMNUBC!',
    LOANER_EMAIL_HAVE_SUBJECT:'UMNUBC Loan Automator - Have ',
    LOANER_EMAIL_HAVE_BODY:'We have received your submission to loan a book. We will inform you should someone apply to make use of your generous offer.\n\n\nThank you for using the Loan Automator, brought to you by UMNUBC!',
    LOANER_EMAIL_NEED_SUBJECT:'UMNUBC Loan Automator - Need ',
    LOANER_EMAIL_NEED_BODY:'We have received your request for a book loan. We will inform you should a third party come forward with a copy of the requested book.\n\n\nThank you for using the Loan Automator, brought to you by UMNUBC!',
    
    ERROR_CONTAINER_BOUND:'Script is not container-bound. Project needs to be bound to an active spreadsheet!',
    ERROR_NOT_INSTALLED:'Automator has not been installed!',
    
    //descriptions for public properties - property name + '_desc'
    vote_form_url_desc:'Direct link to edit version of the current ballot form.',
    vote_template_form_url_desc:'Direct link to edit version of the form used as template for vote forms. New vote forms will be co-located with this file.',
    vote_placeholder_image_url_desc:'Direct link to publicly accessible image file. Ballot item covers will default to this image.',
    vote_count_desc:'Count of responses on ballot form.',
    vote_current_leader_desc:'Title and author of current vote leader.',
    suggestion_form_url_desc:'Direct link to edit version of the current suggestions form.',
    suggestion_template_form_url_desc:'Direct link to edit version of the form used as template for suggestion forms. New suggestion forms will be co-located with this file.',
    suggestion_response_count_desc:'Count of responses on suggestion form.',
    loaner_form_url_desc:'Direct link to edit version of the book loaner form.',
    loaner_template_form_url_desc:'Direct link to edit version of the form used as template for loaner forms. New loaner forms will be co-located with this file.',
    loaner_current_book_desc:'Title of this month\'s current book. Used for loaner form automation.',
    loaner_have_count_desc:'Count of loaner form users indicating willingness to loan this month\'s book. This is the total number, not the amount remaining.',
    loaner_need_count_desc:'Count of loaner form users indicating need to acquire this month\'s book. This is the total number, not the amount remaining.',
    loaner_matches_count_desc:'Count of matches between loaner form users for this month\'s book.',
        
  };
}

function resetScriptProperties(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var properties = getDefaultScriptProperties();
  
  scriptProperties.setProperties(properties, true);
}