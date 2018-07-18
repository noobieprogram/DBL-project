import 'bootstrap';
import FileUploader from './FileUploader';
import SunBurst from './SunBurst';
import './HexaGrid';
import doevis3 from './Directory';
import Tree from './Tree';
import Messages from './Messages';
import Loading from './Loading';
import $ from 'jquery';

// Daan Hegger
// When the page loads, initialize the fileUploader
// On default all the files from the server are fetched
window.onload = () => {
  let fileUploader = new FileUploader();
  fileUploader.onDataReady = onDataReady;
};

// Daan Hegger
// This function gets called when parsed data is ready
// Here, all the visualisation classes can be constructed
function onDataReady(root) {

  try {
    new SunBurst(root);
  } catch(e) {
    console.error('Daan still has errors...!');
    console.error(e);
  }

  try {
    new Tree(root);
  } catch(e) {
    console.error('Matthijs/Abdullah still has errors...!');
    console.error(e);
  }

  try {
    doevis3(root);
  } catch(e) {
    console.error('Pieter still has errors...!');
  }

  try {
    window.visDataReady(this.root);
  } catch(e) {
    console.error('Hexagrid errors...');
    console.error(e);
  }


  Loading.stop();
}

let helpButtons = document.querySelectorAll('.help');

helpButtons.forEach((button) => {
  button.onclick = onHelpClick;
});

function onHelpClick(e) {
  if (e.target.classList.contains('sunburst')) {
    modal('Sunburst Help', `
      Interactions:
      <ol>
        <li><strong>Hover</strong> over a element to show it&quot;s path to the root.</li>
        <li>Use the <strong>coloring</strong> of the elements to easily see seperate branches.</li>
        <li><strong>Click</strong> on a element to zoom in on the dataset, making the clicked element the new visualised root of the diagram</li>
        <li>Use the <strong>settings</strong> (checkboxes) to disable the labels. This is usefull to more easily see the shape of a dataset when it is large.</li>
      </ol>
    `);
  } else if (e.target.classList.contains('tree')) {
    modal('Tree Help', `
    This is the Fractal Tree visualiazation. In essence, the root is represented by the trunk of the tree and children are represented by branches connected to the parent. Four interactions are possible for this visualization:
    <ol>
      <li>You can change the colour of background using the color picker</li>
      <li>You can change the colour of tree using the color picker</li>
      <li>You can hover your mouse pointer over a node to display it's name</li>
      <li>You can click on a node to make to make it the root of a new sub-tree ("zoom")</li>
    </ol>
    `);
  } else if (e.target.classList.contains('hexagrid')) {
    modal('Hexagrid Help', `
      Interactions:
      <ol>
        <li>Click on 'Details' and click on a node to show details about a node, such as its name, the number of children, height etc.</li>
        <li>Click on 'Make Subtree' or press Alt and click on a node to make the subtree rooted at the clicked node the entire tree that gets shown.</li>
        <li>Click on 'Show and Hide' or press Shift and click on a node to hide the subtree rooted at the clicked node. Click once more to show it again.</li>
        <li>Click on 'Highlight' or press Ctrl and click on a node to highlight the subtree rooted at this node. Click once more to undo your action.</li>
      </ol>
    `);
  } else if (e.target.classList.contains('directory')) {
    modal('Directory Structure Help', `
      Click on a red node to expand all its children, and click it again to collapse them all. Nodes with a black border are leaves. By shift-clicking on a node it redraws the visualization but with the selected node as root, this also adds the paths of the predecessors above, so by clicking any predecessor one can go back up. The nodes can be sorted on various properties, both ascending and descending by selecting in the lists. Finally one can press extend and collapse all to expand or collapse all nodes in the tree. WARNING: in very big data sets this can break the visualization.
    `);
  }

}

function modal(title, content) {
  $(`<div class='modal' tabindex='-1' role='dialog'>
      <div class='modal-dialog' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title'>${title}</h5>
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <p>${content}</p>
          </div>
          <div class='modal-footer'>
            <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>
          </div>
        </div>
      </div>
    </div>
  `).modal();
}
