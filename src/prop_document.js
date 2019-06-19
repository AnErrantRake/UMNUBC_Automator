function getDefaultDocumentProperties(){
    return {
      vote_form_url: '',
      vote_template_form_url: '',
      vote_count: '',
      vote_current_leader: '',
      vote_placeholder_image_url: '',
      suggestion_form_url:'',
      suggestion_template_form_url: '',
      suggestion_response_count: '',
      loaner_form_url: '',
      loaner_template_form_url: '',
      loaner_current_book: '',
      loaner_have_count: '',
      loaner_need_count: '',
      loaner_matches_count: '',
  };
}

function resetDocumentProperties(){
  var documentProperties = PropertiesService.getDocumentProperties();
  var properties = getDefaultDocumentProperties();

  documentProperties.setProperties(properties, true);
}
