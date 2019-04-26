function overrideSuggestionForm(){
  util_PublicPropertyPrompt('suggestion_form_url');
  updateDashboard();
}

function updateSuggestionTemplate(){
  util_PublicPropertyPrompt('suggestion_template_form_url');
  updateDashboard();
}

function overrideVoteForm(){
  util_PublicPropertyPrompt('vote_form_url');
  updateDashboard();
}

function updateVoteTemplate(){
  util_PublicPropertyPrompt('vote_template_form_url');
  updateDashboard();
}

function updateVotePlaceholder(){
  util_PublicPropertyPrompt('vote_placeholder_image_url');
  updateDashboard();
}

function updateLoanerTemplate(){
  util_PublicPropertyPrompt('loaner_template_form_url');
  updateDashboard();
}

function forceUpdate(){
  //update loaner form with new title
  loaner_updateBookTitle();
  updateDashboard();
}
