import $ from 'jquery';
import Node from './Node';
import Messages from './Messages';
import Loading from './Loading';

// Daan Hegger
class FileUploader {

  // Daan Hegger
  constructor(onDataReady) {
    // Defaults
    this.listFiles();
    this.onDataReady = onDataReady;

    // Variables
    this.fileInput = document.getElementById('file-uploader');
    this.files = document.querySelectorAll('.file');

    // When file upload gets a file, uplaod it
    this.fileInput.onchange = this.upload.bind(this);
  }

  // Pieter Jacobs
  upload(event) {
    let file = event.target.files[0];

    let data = new FormData();
    data.append('fileToUpload', file);

    fetch('upload.php', {
      method: 'POST',
      body: data
    }).then(res => res.json())
      .then((data) => {
        Messages.clear();
        Messages.log(data.message, data.type);
        this.listFiles();
      });
  }

  // Daan Hegger
  // Request the PHP server a list of files in JSON format
  listFiles() {
    const cThis = this;

    $('.fetched').each(function() {
      $(this).remove();
    });

    fetch('lijst.php')
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        let first = true;
        for (var file of data) {
          let fileName = file.substring(10);

          let nameLength = 16;
          let shortName = (fileName.length > nameLength) ? fileName.substring(0, nameLength) + '...' : fileName;

          let fileBox = $(`
            <div class="file fetched" data-filename="${fileName}" title="${fileName}">
              <div class="file-name">${shortName}</div>
              <div class="file-menu">
                <i class="material-icons delete" title="Delete">delete</i>
              </div>
            </div>
          `);

          fileBox.get(0).onclick = (e) => {
            let fileName = fileBox.get(0).dataset.filename;
            if (e.target.classList.contains('delete')) {
              cThis.remove(fileName);
            } else {
              cThis.choose(fileName);
            }
          };

          fileBox.prependTo('.file-container');

          if (first) {
            first = false;
            cThis.choose(fileName);
          }
        }
      });
  }

  // Pieter Jacobs
  // Send a request to the PHP server to delete a file with a specific filename
  remove(fileName) {
    let cThis = this; // cache class context;
    var data = new FormData();
    data.append('name', fileName);
    fetch('remove.php', {
      method: 'POST',
      body: data
    })
      .then(function(res) {
        return res.text();
      })
      .then(function() {
        cThis.listFiles();
      });
  }

  // Daan Hegger
  // Request the text content of a file from the server
  choose(fileName) {
    let cThis = this;

    Loading.start();

    fetch('uploads/' + fileName)
      .then(function(res) {
        return res.text();
      })
      .then(function(data) {
        cThis.root = cThis.parse(data);
        cThis.setSelectedFile(fileName);
        cThis.onDataReady(cThis.root);
      });
  }

  // Pieter Jacobs
  parse(text) {

    function maketree(index, root) {

      while (true) {

        var laatstekomma = text.lastIndexOf(',', index - 1);
        var laatstehaakje = text.lastIndexOf(')', index - 1);
        var laatstesluitend = text.lastIndexOf('(', index - 1);

        if (laatstesluitend == -1 && laatstekomma == -1) { // er is geen sluitend ding of komma meer dus alles is geparsed (gebeurt alleen bij eerste keer aanroepen)
          var naam = text.substring(0, index).trim();
          var newchild = new Node(naam, root, []);
          var newindex = 0;

          root.children.push(newchild);
          return 0;
        }

        if (text.charAt(index) == '(') { // laatste element subtree is net geparsed
          return Math.max(text.lastIndexOf(',', index - 1), text.lastIndexOf('(', index - 1)) + 1;
        }

        if (laatstekomma < laatstehaakje && laatstesluitend < laatstehaakje) { // heeft een subtree
          var naam = text.substring(laatstehaakje + 1, index).trim();
          var newchild = new Node(naam, root, []);

          var newindex = maketree(laatstehaakje, newchild);

          root.children.push(newchild);

          index = newindex - 1;
        }

        if (laatstehaakje < laatstesluitend || laatstehaakje < laatstekomma) { // heeft geen subtree
          var poep = Math.max(laatstesluitend, laatstekomma);
          var naam = text.substring(poep + 1, index).trim();
          var newchild = new Node(naam, root, []);

          root.children.push(newchild);

          index = poep;
        }


      }
    }

    text = text.trim();
    text = text.replace(/\n/g, '');
    var superroot = new Node('', null, []);
    maketree(text.length - 1, superroot);
    var echteroot = superroot.children[0];
    echteroot.parent = null;
    return echteroot;
  }

  setSelectedFile(fileName) {
    let files = document.querySelectorAll('.file.fetched');
    files.forEach((fileBox) => {
      if (fileBox.dataset.filename == fileName) {
        fileBox.classList.add('active');
      } else {
        fileBox.classList.remove('active');
      }
    });
  }


}

export default FileUploader;
