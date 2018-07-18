// Pieter

import './Node';

var sorttype = 'original';
var sortdir = 'desc';
var vis3root;
var vis3uberroot;

function getdepth(node, root) {
  if (node.parent == null)
    return 0;
  else {
    return 1 + getdepth(node.parent, root);
  }
}

function shiftroot(ding) {
  doevisualization(ding);
  vis3root = ding;

  if (ding.parent == null)
    return;

  var asdf = document.createElement('span');

  function createPath(node) {
    if (node == null)
      return;

    var newpar = document.createElement('span');
    newpar.className = 'terug';
    newpar.onclick = function() {
      shiftroot(node);
    };
    newpar.innerHTML = (node.name == '' ? '<i>unnamed</i>' : node.name);

    var newgt = document.createElement('span');
    newgt.innerHTML = ' > ';

    asdf.insertBefore(newgt, asdf.childNodes[0]);
    asdf.insertBefore(newpar, asdf.childNodes[0]);

    createPath(node.parent);
  }

  createPath(ding.parent);


  document.querySelector('#outputecht').insertBefore(asdf, document.querySelector('#outputecht').childNodes[0]);

}

function vis3Click(object, event) {
  console.log(event[0].shiftKey);
  if (!event[0].shiftKey)
    klappen(object);
  else
    shiftroot(object.parentNode.ding);
}

function vis3CreateSpan(node, div) {
  var tmpspan = document.createElement('span');
  tmpspan.onclick = function() {
    vis3Click(this, arguments);
  };
  tmpspan.onmouseover = function() {
    vis3hover(this);
  };
  tmpspan.innerHTML = (node.name == '' ? '<i>unnamed</i>' : node.name) + '<span style=\'float: right\'>' + node.childrenAmount + ' children + ' +
    node.descendentsAmount + ' descendents</span>';

  div.appendChild(tmpspan);
}

function vis3CreateRecursive(node, div) {
  if (node.ochildren === undefined)
    node.ochildren = node.children.slice();
  else
    node.children = node.ochildren.slice();

  function g(a, b) {
    if (sortdir == 'asc')
      return a > b;
    return a < b;
  }

  if (sorttype == 'original' && sortdir == 'asc')
    node.children.reverse();

  node.children.sort(function(a, b) {

    if (sorttype == 'name')
      return g(a.name, b.name);

    if (sorttype == 'descendants')
      return g(a.descendentsAmount, b.descendentsAmount);

    if (sorttype == 'children')
      return g(a.childrenAmount, b.childrenAmount);
  });


  for (var child of node.children) {
    vis3Create(child, div);
  }
}

function vis3hover(object) {
  var node = object.parentNode.ding;
  object.title = 'This subtree has: \n- a height of ' + node.height + '\n- a depth (from the root) of ' + getdepth(node, vis3uberroot) + '\n' +
    '- a total of ' + (node.descendentsAmount + 1) + ' nodes \nAnd the nodes in this subtree have: \n- a mean height of ' + node.meanHeight;
}

function vis3Create(node, div) {

  var tmpobj = document.createElement('div');
  tmpobj.className = 'node';
  tmpobj.ding = node;
  tmpobj.setAttribute('klap', node.uit && node.children.length != 0 ? 'uit' : 'in');
  tmpobj.setAttribute('leaf', (node.childrenAmount == 0 ? '0' : 'sdf'));

  if (div.ding !== undefined) {
    div.ding.uit = true;
    div.setAttribute('klap', 'uit');
  }

  vis3CreateSpan(node, tmpobj);

  div.appendChild(tmpobj);

  if (node.uit) {
    vis3CreateRecursive(node, tmpobj);
  }
}

function doevisualization(root) {
  document.querySelector('#outputecht').innerHTML = '';
  vis3Create(root, document.querySelector('#outputecht'));
  vis3root = root;
}

window.changesort =  function() {
  sorttype = document.querySelector('#selector').value;
  sortdir = document.querySelector('#asc').value;
  shiftroot(vis3root);
};

window.vis3extend = function(bool) {
  function loopall(root, bool) {
    root.uit = bool;
    for (var child of root.children)
      loopall(child, bool);
  }
  loopall(vis3uberroot, bool);

  shiftroot(vis3root);
  console.log(vis3uberroot);
};

export default function doevis3(root) {
  vis3uberroot = root;
  document.querySelector('#vis-dir-container').innerHTML = 'Sort by: <select id=\'selector\' onchange=\'changesort()\'>\
                        <option value=\'original\'>Original order</option><option value=\'name\'>Name</option>\
                        <option value=\'descendants\'>Amount of descendants</option><option value=\'children\'>Amount of children</option></select>\
                        <select id=\'asc\' onchange=\'changesort()\'><option value=\'desc\'>descending</option>\
                        <option value=\'asc\'>ascending</option></select>\
                        <span class=\'click\' onclick=\'vis3extend(true)\'>Extend all nodes</span>\
                        <span class=\'click\' onclick=\'vis3extend(false)\'>Collapse all nodes</span>\
                        </br><span style=\'color: red;\'>Warning: do not use the <i>extend/collapse all</i> for big trees</span>\
                        <div id=\'outputecht\'></div>'
  doevisualization(root);
}

function klappen(object) {
  var divThisNode = object.parentNode;
  var node = object.parentNode.ding;

  if (node.uit) {
    node.uit = false;
    divThisNode.innerHTML = '';
    divThisNode.setAttribute('klap', node.uit && node.children.length != 0 ? 'uit' : 'in');

    vis3CreateSpan(node, divThisNode);

  } else {
    node.uit = true;
    divThisNode.setAttribute('klap', node.uit && node.children.length != 0 ? 'uit' : 'in');

    vis3CreateRecursive(node, divThisNode);
  }

}
