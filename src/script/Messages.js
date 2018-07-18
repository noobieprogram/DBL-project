// Daan Hegger

export default class Messages {

  constructor() {
    throw new Error('Can\'t create an instance of Messages');
  }

  static get container() {
    return document.getElementById('messages');
  }

  static error(message) {
    this.container.innerHTML += `
      <div class="alert alert-danger" role="alert">
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;
  }

  static success(message) {
    this.container.innerHTML += `
      <div class="alert alert-success" role="alert">
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;
  }

  static info(message) {
    this.container.innerHTML += `
      <div class="alert alert-info" role="alert">
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;
  }

  static clear() {
    document.getElementById('messages').innerHTML = '';
  }

  static log(message, type) {
    if (type == 'success') {
      this.success(message);
    } else if (type == 'error') {
      this.error(message);
    } else if (type == 'info') {
      this.info(message);
    }
  }

}
