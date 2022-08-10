import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /**
   * Render the received data to the DOM
   * @param {object | object[]} data The data to be rendered (e.g recipe)
   * @returns
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //console.log(this);
    this._data = data;
    //console.log(this._data);
    const markUp = this._generateMarkup();
    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    //console.log(this);
    this._data = data;
    const newMarkUp = this._generateMarkup();

    //convert markup strig to DOM objects which live in a memory and we can compare old markup DOM with new markup DOM and update only those DOM object that are changed

    const newDOM = document.createRange().createContextualFragment(newMarkUp); //this method will convert string of markup to real DOM elements. So here, newDOM will become an object which will be like virtual DOM(doesnt live on the page but only in a memory)

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);
    // console.log(curElements);

    /////comparing 2 arrays
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));
      ///Updates changes Text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl);
        // console.log(newEl.firstChild);
        // console.log(newEl.firstChild.nodeValue);
        //console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      } //use nodeValue to replace only text content of the node. //firstchild is the textElement and nodeValue of the first child will be text content. newEk is just an node element and not value.

      //Updates changed Attributes

      if (!newEl.isEqualNode(curEl)) {
        //console.log(Array.from(newEl.attributes));
        //console.log(Array.from(curEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
        //console.log(newEl.attributes);
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markUp = `
        <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
        </div>`;
    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderError(message = this._errorMessage) {
    const markUp = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMessage(message = this._message) {
    const markUp = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
