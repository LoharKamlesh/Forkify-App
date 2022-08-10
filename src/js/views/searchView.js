class SearchView {
  #parentElement = document.querySelector('.search');
  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
    //cant directly call handler function bcoz we need to prevent default behaviour of the form i.e it reload page bydefault.
    //applying eventlistner to whole form and not just subi=mit button so that form gets submit when user clicks enter.
  }
}

export default new SearchView();
