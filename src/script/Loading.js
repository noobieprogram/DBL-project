// Daan Hegger

export default class Loading {

  constructor() {
    throw new Error('Static class dont create me');
  }

  static start() {
    this.root.innerHTML = `
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
      <div class="loading-text">Loading</div>
    `;
  }

  static stop() {
    this.root.innerHTML = '';
  }

  static get root() {
    return document.getElementById('loading-container');
  }

}
