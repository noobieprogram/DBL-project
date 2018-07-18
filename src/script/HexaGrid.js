// Paul and Rik worked on this visualization

//Some random variable declaration
var lineLength = 20;
var treeHeight = 3;
var returnedNode;

// Set up of canvas!
var a_canvas = document.getElementById('hexagrid-canvas');
var context = a_canvas.getContext('2d');

//Listener for the click event to be used by the interactions
a_canvas.addEventListener('click', ifShift);

//=========================================================================================================
//interactions

var detailsInteraction = false;
var makeSubtreeInteraction = false;
var showHideInteraction = false;
var highlightInteraction = false;

//the button function is made by Rik Nietsch
window.toggleButton = function(text) {
  //console.log(text);
  if ((detailsInteraction && text !== 'details') || (makeSubtreeInteraction && text !== 'makeSubtree') || (showHideInteraction && text !== 'showHide') || (highlightInteraction && text !== 'highlight')) { //if multiple buttons have been pressed an odd number of times
    // alert('Please only press at most one button an odd number of times');
    detailsInteraction = false;
    makeSubtreeInteraction = false;
    showHideInteraction = false;
    highlightInteraction = false;
  }
  if (text == 'details') {
    if (detailsInteraction) {
      detailsInteraction = false;
    } else {
      detailsInteraction = true;
    }
    //console.log('should details be shown?', detailsInteraction);
  } else if (text == 'showHide') {
    if (showHideInteraction) {
      showHideInteraction = false;
    } else {
      showHideInteraction = true;
    }
    //console.log('should showHide be shown?', showHideInteraction);
  } else if (text == 'makeSubtree') {
    if (makeSubtreeInteraction) {
      makeSubtreeInteraction = false;
    } else {
      makeSubtreeInteraction = true;
    }
    //console.log('should makeSubtree be shown?', makeSubtreeInteraction);
  } else { //highlight
    if (highlightInteraction) {
      highlightInteraction = false;
    } else {
      highlightInteraction = true;
    }
    //console.log('should highlight be shown?', highlightInteraction);
  }
}

//the details logic is made by Rik Nietsch
//the showHide and makeSubtree are made by Rik Nietsch and Paul Kabo
//Function to select which interactions is used when a clickevent occurs based on the pressed key
function ifShift(event) {
  if (window.event.shiftKey || showHideInteraction) {
    clickedLocation(event);
    //console.log(returnedNode);
    context.clearRect(0, 0, a_canvas.width, a_canvas.height)
    //showHide(returnedNode);
    //console.log(computeCompactedEdgeLength(returnedNode))
    for (var c of returnedNode.children) {
      if (c.shown === false) {
        returnedNode.shown = false;
      } else {
        returnedNode.shown = true;
      }
    }
    if (returnedNode.shown === false) {
      setShown(returnedNode);
    } else {
      //console.log('Hiding kids ' + returnedNode)
      hideKids(returnedNode);
    }
    drawGrid(3, 20)
    drawTree(trueRoot, -1, 0, 0, 0, 0);
  } else if (window.event.ctrlKey || highlightInteraction) {
    clickedLocation(event);
    //console.log(returnedNode);
    context.clearRect(0, 0, a_canvas.width, a_canvas.height)
    //showHide(returnedNode);
    //console.log(computeCompactedEdgeLength(returnedNode))
    highLight(returnedNode);
    drawGrid(3, 20)
    drawTree(trueRoot, -1, 0, 0, 0, 0);
  } else if (window.event.altKey || makeSubtreeInteraction) {
    clickedLocation(event);
    context.clearRect(0, 0, a_canvas.width, a_canvas.height)
    drawGrid(3, 20)
    if (returnedNode == trueRoot) {
      if (returnedNode.parent !== null) {
        drawTree(returnedNode.parent, -1, 0, 0, 0, 0);
      } else {
        drawTree(returnedNode, -1, 0, 0, 0, 0);
      }
    } else {
      drawTree(returnedNode, -1, 0, 0, 0, 0);
    }
  } else if (window.event.tabKey || detailsInteraction) {
    clickedX = event.offsetX;
    clickedY = event.offsetY;
    //console.log(clickedX, clickedY);
    var clickedNodeDetails = findClickedNodeDetails(trueRoot);
    if (clickedNodeDetails.parent == null) {
      //console.log('name:',clickedNodeDetails.name,'name of the parent: this node has no parent', 'number of children:',clickedNodeDetails.childrenAmount,'number of descendant:',clickedNodeDetails.descendentsAmount, 'height:',clickedNodeDetails.height);
    } else {
      //console.log('name:',clickedNodeDetails.name,'name of the parent:',clickedNodeDetails.parent.name, 'number of children:',clickedNodeDetails.childrenAmount,'number of descendant:',clickedNodeDetails.descendentsAmount, 'height:',clickedNodeDetails.height);
    }
    //console.log(clickedNodeDetails);
    // findClickedNode(trueRoot);
    //console.log(returnedNode);
    //=====================================================================================================================================================
    //TO DO
    // if (clickedNodeDetails !== undefined) {
    // show the details
    //console.log(clickedNodeDetails.name, clickedNodeDetails.x, clickedNodeDetails.y, clickedNodeDetails.z); //ADD MORE DETAILS HERE
    // }
  }
}

//function made by Rik Nietsch
function findClickedNodeDetails(node) {
  realX = convertCoords(node.x, node.y, node.z, 'x');
  realY = convertCoords(node.x, node.y, node.z, 'y');
  var returnNode;
  //console.log(node.name, realX, realY);
  if (realX - 10 <= clickedX && clickedX <= 10 + realX && realY - 10 <= clickedY && clickedY <= 10 + realY) { //TO DO: tweaking with range
    //console.log('werkt');
    return node;
  } else {
    //console.log('else');
    for (var c of node.children) {
      //console.log(c);
      var returnNodeChild = findClickedNodeDetails(c);
      //console.log(returnNodeChild);
      if (returnNodeChild !== undefined) {
        //console.log(returnNodeChild);
        return returnNodeChild;
      }
    }
  }
}

var height = getHeight(3, 20);
var width = drawGrid(3, 20);

function highLight(node) {
  if (node.color == '#00FFFF') {
    node.color = '#FF0000'
  } else {
    node.color = '#00FFFF'
  }
  for (var c of node.children) {
    highLight(c);
  }
  return;
}

function getHeight(treeHeight, lineLength) {
  context.lineWidth = 1;
  var lineLength = lineLength
  width = 0;
  for (var i = 0; i <= treeHeight - 1; i++) {
    width = width + Math.pow(3, treeHeight - i - 1);
  }
  width = width * 2;
  height = Math.sqrt((3 / 4) * Math.pow(width, 2))
  return height;
}

//Function for drawing the grid based on the depth of a tree
function drawGrid(treeHeight, lineLength) {
  context.lineWidth = 1;
  var lineLength = lineLength
  width = 0;
  for (var i = 0; i <= treeHeight - 1; i++) {
    width = width + Math.pow(3, treeHeight - i - 1);
  }
  width = width * 2;
  height = Math.sqrt((3 / 4) * Math.pow(width, 2))
  context.strokeStyle = '#808080';

  //console.log(width + ' ' + height)

  //draw horizontal lines
  for (i = 0; i < width + 3; i++) { //+3 and +2 in the function r padding
    context.beginPath();
    context.moveTo(0, i * lineLength * (height / width));
    context.lineTo((width + 2) * lineLength, i * lineLength * (height / width));
    context.stroke();
  }


  //draw two vertical border lines
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, lineLength * (width + 2) * (height / width));
  context.stroke();
  context.beginPath();
  context.moveTo((width + 2) * lineLength, 0);
  context.lineTo((width + 2) * lineLength, lineLength * (width + 2) * (height / width));
  context.stroke();


  //draw the vertical (left leaning) lines
  //--------------------------------------------------------------------------------
  for (var i = 0; i < (width / 2) + 1; i++) { //+3 and +2 in the function r padding
    if (width % 4 === 0) { //when shit is even
      context.beginPath();
      context.moveTo(0.5 * lineLength + lineLength * i, lineLength * (width + 2) * (height / width));
      context.lineTo(0, height * lineLength - (lineLength * 2 * (height / width)) * i + (lineLength * (height / width)));
      context.stroke();
    } else { //when shit is odd
      context.beginPath();
      context.moveTo(lineLength + lineLength * i, lineLength * (width + 2) * (height / width));
      context.lineTo(0, height * lineLength - (lineLength * 2 * (height / width)) * i);
      context.stroke();
    }
  }

  for (var i = 0; i < (width / 2) + 1; i++) { //+3 and +2 in the function r padding
    if (width % 4 === 0) { //when shit is even
      context.beginPath();
      context.moveTo(lineLength + lineLength * i - 0.5 * lineLength + ((width / 2) + 1) * lineLength, lineLength * (width + 2) * (height / width));
      context.lineTo(lineLength * i + 0.5 * lineLength, 0);
      context.stroke();
    } else { //when shit is odd
      context.beginPath();
      context.moveTo(lineLength + lineLength * i + ((width / 2) + 1) * lineLength, lineLength * (width + 2) * (height / width));
      context.lineTo(lineLength + lineLength * i, 0);
      context.stroke();
    }
  }

  for (var i = 0; i < (width / 2) + 1; i++) { //+3 and +2 in the function r padding
    if (width % 4 === 0) { //when shit is even
      context.beginPath();
      context.moveTo((width + 2) * lineLength, height * lineLength - (lineLength * 2 * (height / width)) * i + (lineLength * (height / width)));
      context.lineTo(lineLength + lineLength * i + ((width / 2) + 1) * lineLength - 0.5 * lineLength, 0);
      context.stroke();
    } else { //when shit is odd
      context.beginPath();
      context.moveTo((width + 2) * lineLength, height * lineLength - (lineLength * 2 * (height / width)) * i);
      context.lineTo(lineLength + lineLength * i + ((width / 2) + 1) * lineLength, 0);
      context.stroke();
    }
  }
  //--------------------------------------------------------------------------------

  //draw the vertical (right leaning) lines
  //--------------------------------------------------------------------------------
  for (var i = 0; i < (width / 2) + 1; i++) { //+3 and +2 in the function r padding
    if (width % 4 === 0) { //when shit is even
      context.beginPath();
      context.moveTo(0, height * lineLength - (lineLength * 2 * (height / width)) * i + (lineLength * (height / width)));
      context.lineTo(lineLength * (width) / 2 - lineLength * i + 0.5 * lineLength, 0);
      context.stroke();
    } else { //when shit is odd
      context.beginPath();
      context.moveTo(0, (lineLength * 2 * (height / width)) * i + (lineLength * 2 * (height / width)));
      context.lineTo(lineLength + lineLength * i, 0);
      context.stroke();
    }
  }

  for (var i = 0; i < (width / 2) + 1; i++) { //+3 and +2 in the function r padding
    if (width % 4 === 0) { //when shit is even
      context.beginPath();
      context.moveTo(0.5 * lineLength + lineLength * i, lineLength * (width + 2) * (height / width));
      context.lineTo(lineLength + lineLength * i + ((width / 2) + 1) * lineLength - 0.5 * lineLength, 0);
      context.stroke();
    } else { //when shit is odd
      context.beginPath();
      context.moveTo(lineLength + lineLength * i, lineLength * (width + 2) * (height / width));
      context.lineTo(lineLength + lineLength * i + ((width / 2) + 1) * lineLength, 0);
      context.stroke();
    }
  }

  for (var i = 0; i < (width / 2) + 1; i++) { //+3 and +2 in the function r padding
    if (width % 4 === 0) { //when shit is even
      context.beginPath();
      context.moveTo(lineLength + lineLength * i - 0.5 * lineLength + ((width / 2) + 1) * lineLength, lineLength * (width + 2) * (height / width));
      context.lineTo((width + 2) * lineLength, (lineLength * 2 * (height / width)) * i + (lineLength * (height / width)));
      context.stroke();
    } else { //when shit is odd
      context.beginPath();
      context.moveTo(lineLength + lineLength * i + ((width / 2) + 1) * lineLength, lineLength * (width + 2) * (height / width));
      context.lineTo((width + 2) * lineLength, (lineLength * 2 * (height / width)) * i + (lineLength * 2 * (height / width)));
      context.stroke();
    }
  }

  return width;
}

context.strokeStyle = '#808080';



context.strokeStyle = '#000000';
//--------------------------------------------------------------------------------


//drawNode(x, y, z, and color)
function drawNode(x, y, z, colorRGB) {
  var xAdjust = 0;
  xAdjust = xAdjust + x * lineLength; //x
  xAdjust = xAdjust - y * 0.5 * lineLength; //y
  xAdjust = xAdjust + z * 0.5 * lineLength; //z
  var yAdjust = 0;
  if (y !== 0) {
    yAdjust = yAdjust - Math.abs(y) / y * Math.sqrt((3 / 4) * Math.pow(lineLength * y, 2)); //y
  }
  if (z !== 0) {
    yAdjust = yAdjust - Math.abs(z) / z * Math.sqrt((3 / 4) * Math.pow(lineLength * z, 2)); //z
  }

  context.fillStyle = colorRGB;
  context.beginPath();
  context.arc(((width + 2) * lineLength) / 2 + xAdjust, (lineLength * (width + 2) * (height / width)) / 2 + yAdjust, 5, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
  //return yAdjust;
  return;
}

//Function to draw the lines between nodes
function drawLine(xfrom, yfrom, zfrom, xto, yto, zto, colorRGB) {
  context.strokeStyle = '#000000';
  context.strokeStyle = colorRGB;
  context.lineWidth = 3;

  var xAdjustfrom = 0;
  xAdjustfrom = xAdjustfrom + xfrom * lineLength; //x
  xAdjustfrom = xAdjustfrom - yfrom * 0.5 * lineLength; //y
  xAdjustfrom = xAdjustfrom + zfrom * 0.5 * lineLength; //z
  var yAdjustfrom = 0;
  if (yfrom !== 0) {
    yAdjustfrom = yAdjustfrom - Math.abs(yfrom) / yfrom * Math.sqrt((3 / 4) * Math.pow(lineLength * yfrom, 2)); //y
  }
  if (zfrom !== 0) {
    yAdjustfrom = yAdjustfrom - Math.abs(zfrom) / zfrom * Math.sqrt((3 / 4) * Math.pow(lineLength * zfrom, 2)); //z
  }


  var xAdjustto = 0;
  xAdjustto = xAdjustto + xto * lineLength; //x
  xAdjustto = xAdjustto - yto * 0.5 * lineLength; //y
  xAdjustto = xAdjustto + zto * 0.5 * lineLength; //z
  var yAdjustto = 0;
  if (yto !== 0) {
    yAdjustto = yAdjustto - Math.abs(yto) / yto * Math.sqrt((3 / 4) * Math.pow(lineLength * yto, 2)); //y
  }
  if (zto !== 0) {
    yAdjustto = yAdjustto - Math.abs(zto) / zto * Math.sqrt((3 / 4) * Math.pow(lineLength * zto, 2)); //z
  }

  context.beginPath();
  context.moveTo(((width + 2) * lineLength) / 2 + xAdjustfrom, (lineLength * (width + 2) * (height / width)) / 2 + yAdjustfrom);
  context.lineTo(((width + 2) * lineLength) / 2 + xAdjustto, (lineLength * (width + 2) * (height / width)) / 2 + yAdjustto);
  context.stroke();

  return;
}

function parse(text) {

  function maketree(index, root) {

    while (true) {

      var laatstekomma = text.lastIndexOf(',', index - 1);
      var laatstehaakje = text.lastIndexOf(')', index - 1);
      var laatstesluitend = text.lastIndexOf('(', index - 1);

      if (laatstesluitend == -1 && laatstekomma == -1) { // er is geen sluitend ding of komma meer dus alles is geparsed (gebeurt alleen bij eerste keer aanroepen)
        var naam = text.substring(0, index).trim();
        var newchild = new node(naam, root, []);
        var newindex = 0;

        root.children.push(newchild);
        return 0;
      }

      if (text.charAt(index) == '(') { // laatste element subtree is net geparsed
        return Math.max(text.lastIndexOf(',', index - 1), text.lastIndexOf('(', index - 1)) + 1;
      }

      if (laatstekomma < laatstehaakje && laatstesluitend < laatstehaakje) { // heeft een subtree
        var naam = text.substring(laatstehaakje + 1, index).trim();
        var newchild = new node(naam, root, []);

        var newindex = maketree(laatstehaakje, newchild);

        root.children.push(newchild);

        index = newindex - 1;
      }

      if (laatstehaakje < laatstesluitend || laatstehaakje < laatstekomma) { // heeft geen subtree
        var poep = Math.max(laatstesluitend, laatstekomma);
        var naam = text.substring(poep + 1, index).trim();
        var newchild = new node(naam, root, []);

        root.children.push(newchild);

        index = poep;
      }


    }
  }

  text = text.trim();
  text = text.replace(/\n/g, '');
  //console.log(text);
  var superroot = new node('', null, []);
  maketree(text.length - 1, superroot);
  var echteroot = superroot.children[0];
  echteroot.parent = null;
  return echteroot;
}

class node {
  constructor(name, parent, children) {
    this.parent = parent
    this.children = children
    this.name = name
    this.shown = true
    this.num = NaN
    this.dir = NaN
    this.rikCoords = NaN
    this.linelength = 1
    this.linelength2 = null
    this.edgeTrim = NaN
    this.depth
    this.color = '#FF0000'
    //this.descendentsAmount = null
  }

  get childrenAmount() {
    return this.children.length;
  }

  get descendentsAmount() {
    //if (this.descendentsAmount == null){
    var tmp = 0
    for (var child of this.children) {
      tmp += child.descendentsAmount + 1
    }
    return tmp
    //}
    //return this.descendentsAmount
  }
  get height() {
    var max = 0;
    for (var child of this.children) {
      max = Math.max(max, child.height + 1);
    }
    return max;
  }

}

var trueRoot;

function drawTree(root, pdir, x, y, z, depth) {
  //direction to the right is 1, then mod
  root.depth = depth;
  root.rikCoords = convertPaulRik(x, y, z);
  root.x = x
  root.y = y
  root.z = z
  var i;
  var dir = (1 + pdir) % 6;
  root.dir = dir
  if (pdir == -1) {
    root.num = 0;
    i = -1;
    trueRoot = root;
  } else {
    i = 0;
  }

  if (root.depth == 4) {
    return;
  }

  //BEGIN ADJUSTMENT TO PAULS CODE ====================================================================
  if (root === clickedNode) { //if the current root is the node that was clicked
    stop();
  }
  //END ADJUSTMENT TO PAULS CODE ======================================================================


  //drawNode(x, y, z, '#FF0000') //draw root node
  if (root.linelength2 !== null) {
    root.linelength = root.linelength2; //need the fucking depth for this
  } else {
    if (Math.pow(3, trueRoot.height-depth-1) > 9 && root === trueRoot) {
      trueRoot.linelength = 9;
    } else {
      root.linelength = Math.pow(3, 3 - depth - 1);
    }
  }
  var linelength = root.linelength;
  for (var child of root.children) {
    //console.log(root.name + ' ' + child.name + ' ' + dir + ' ' + depth);
    if (i > 4) {
      break;
    } else {
      i = i + 1;
      child.num = i;
      if (root.depth < 3) {
        if (dir == 0) { //pdir 6
          // The order of if statements is here such that lines do not overlap with eachother
          if (child.shown === true) {
            drawLine(x, y, z, x + linelength, y, z);
          }
          if (root.shown === true) {
            drawNode(x, y, z, child.color);
          }
          if (child.shown === true) {
            drawTree(child, 3, x + linelength, y, z, depth + 1);
          }
        } else if (dir == 1) {
          if (child.shown === true) {
            drawLine(x, y, z, x, y - linelength, z);
          }
          if (root.shown === true) {
            drawNode(x, y, z, child.color);
          }
          if (child.shown === true) {
            drawTree(child, 4, x, y - linelength, z, depth + 1);
          }
        } else if (dir == 2) {
          if (child.shown === true) {
            drawLine(x, y, z, x, y, z - linelength);
          }
          if (root.shown === true) {
            drawNode(x, y, z, child.color);
          }
          if (child.shown === true) {
            drawTree(child, 5, x, y, z - linelength, depth + 1);
          }
        } else if (dir == 3) {
          if (child.shown === true) {
            drawLine(x, y, z, x - linelength, y, z);
          }
          if (root.shown === true) {
            drawNode(x, y, z, child.color)
          }
          if (child.shown === true) {
            drawTree(child, 0, x - linelength, y, z, depth + 1);
          }
        } else if (dir == 4) {
          if (child.shown === true) {
            drawLine(x, y, z, x, y + linelength, z);
          }
          if (root.shown === true) {
            drawNode(x, y, z, child.color)
          }
          if (child.shown === true) {
            drawTree(child, 1, x, y + linelength, z, depth + 1);
          }
        } else if (dir == 5) {
          if (child.shown === true) {
            drawLine(x, y, z, x, y, z + linelength);
          }
          if (root.shown === true) {
            drawNode(x, y, z, child.color)
          }
          if (child.shown === true) {
            drawTree(child, 2, x, y, z + linelength, depth + 1);
          }
        }
      }

      //console.log(dir)
      dir = (dir + 1) % 6
      //drawLine(x, y, z, 3, 0, 0)
    }
  }
  if (root.children.length > 5 && root !== trueRoot) {
    drawNode(x, y, z, '#44DD77')
  } else if (root.depth == 3 && root.children.length > 0) {
    drawNode(x, y, z, '#FF00DD')
  } else {
    drawNode(x, y, z, root.color)
  }
}

function convertCoords(x, y, z, xyparam) {

  var xAdjustConvert = 0;
  xAdjustConvert = xAdjustConvert + x * lineLength; //x
  xAdjustConvert = xAdjustConvert - y * 0.5 * lineLength; //y
  xAdjustConvert = xAdjustConvert + z * 0.5 * lineLength; //z
  var yAdjustConvert = 0;
  if (y !== 0) {
    yAdjustConvert = yAdjustConvert - Math.abs(y) / y * Math.sqrt((3 / 4) * Math.pow(lineLength * y, 2)); //y
  }
  if (z !== 0) {
    yAdjustConvert = yAdjustConvert - Math.abs(z) / z * Math.sqrt((3 / 4) * Math.pow(lineLength * z, 2)); //z
  }

  var xReturn = ((width + 2) * lineLength) / 2 + xAdjustConvert;
  var yReturn = (lineLength * (width + 2) * (height / width)) / 2 + yAdjustConvert;
  if (xyparam == 'x') {
    return xReturn;
  } else if (xyparam == 'y') {
    return yReturn;
  } else {
    return null;
  }
}

//
//      Example function by pieter
//
//function printtree(root, pre){
//    var string = '';
//    if (pre.length != 0)
//        string += pre + '-';
//    string += root.name + '\n';

//    for (var child of root.children){
//        string += printtree(child, pre + (pre.length != 0 ? ' |' : '|'));
//        if(child != root.children[root.children.length - 1] && child.childrenAmount != 0)
//            string += pre + (pre.length != 0 ? ' |' : '|') + '\n'
//    }
//    return string
//}

//interaction 1 (highlight or dehighlight) and 2 (show or hide)

// document.addEventListener('click', findMousePosition);
var clickedX;
var clickedY;
var clickedNode;

//function made by Rik Nietsch
//get the location where is clicked
function clickedLocation(event) {
  clickedX = event.offsetX;
  clickedY = event.offsetY;
  //console.log('poep ' + clickedX + ' ' + clickedY)
  clickedNode = findClickedNode(trueRoot);
  //trueRoot is the root of the entire tree
  //console.log(clickedNode);

  // for testing only
  // document.body.textContent = 'x: ' + clickedX + ' , y: ' + clickedY;
}

var realX;
var realY;

//function made by Rik Nietsch
//returns the node that is clicked, if any
function findClickedNode(node) {

  realX = convertCoords(node.x, node.y, node.z, 'x');
  realY = convertCoords(node.x, node.y, node.z, 'y');

  //console.log(realX + ' ' + realY + ' ' + node.name);
  if (-10 + realX <= clickedX && clickedX <= 10 + realX) { //TO DO: tweaking with range
    if (-10 + realY <= clickedY && clickedY <= 10 + realY) {
      //console.log(node);
      //context.clearRect(0, 0, a_canvas.width, a_canvas.height)
      //drawGrid(3, 20)
      //drawTree(node, -1, 0, 0, 0, 0);
      returnedNode = node;
    }
  } else if (node.children === null) {
    return null;
  } else {
    for (var c of node.children) {
      findClickedNode(c);
    }
  }
}

//=========================================================================================================
//interaction: click and highlight subtree rooted at clicked node

//set the highlighted field for every node
function setHighlighted(node) {
  node.highlighted = false;
  if (node.children !== null) {
    for (var c of node.children) {
      setHighlighted(c);
    }
  }
}

//highlights or dehighlights the subtree rooted at the clicked node depending on wether it was already highlighted or not
function highlightDehighlight(node) {
  if (node !== null) { //if a node is clicked
    if (node.highlighted) { //then node gets dehighlighted
      drawNode(node.x, node.y, node.z); //TO DO: colour is black
      if (node.children !== null) {
        for (var c of node.children) {
          //draw the lines from node to c
          drawLine(x, y, z, c.x, c.y, c.z); //TO DO: colour is black
          //recurse on child
          highlightDehighlight(c);
        }
      }
    } else { //the node gets highlighted
      drawNode(node.x, node.y, node.z); //TO DO: colour is RED (default colour nodes is black)
      if (node.children !== null) {
        for (var c of node.children) {
          //draw the lines from node to c
          drawLine(x, y, z, c.x, c.y, c.z); //TO DO: colour is RED (default colour nodes is black)
          //recurse on child
          highlightDehighlight(c);
        }
      }
    }
  }
}

//=========================================================================================================
//interaction 2: click and show or hide the subtree rooted at clicked node

//set the shown field for every node
function setShown(node) {
  node.shown = true;
  if (node.children !== null) {
    for (var c of node.children) {
      //console.log(c)
      setShown(c);
    }
  }
}

function convertPaulRik(x_p, y_p, z_p) {

  var x_r, y_r, z_r;
  x_r = x_p - y_p;
  y_r = -y_p - z_p;
  z_r = x_p + z_p;

  return {
    x_r: x_r,
    y_r: y_r,
    z_r: z_r,
  }

}

function hideKids(node) {
  for (var c of node.children) {
    //console.log(c + ' false')
    c.shown = false;
    hideKids(c);
  }
}

//function made by Rik Nietsch and Paul Kabo
//shows or hide the subtree rooted at the clicked node depending on wether it was already shown or hidden
function showHide(node) {
  //console.log(returnedNode)
  if (node !== null) { //if a node is clicked
    if (node.shown) { //then node gets hidden
      drawTree(trueRoot, node.pdir, node.x, node.y, node.z, node.depth); //recursing from the root of the entire tree
    } else { //then node gets shown
      drawNode(node.x, node.y, node.z); //TO DO: colour is black
      if (node.children !== null) {
        for (var c of node.children) {

          //draw the lines from node to c
          drawLine(node.x, node.y, node.z, c.x, c.y, c.z); //TO DO: colour is black
          //recurse on child
          showHide(c);
        }
      }
    }
  }
}

function doTrim(node, newlength) {
  node.linelength2 = newlength;
  return;
}

function redrawTree() {
  context.clearRect(0, 0, a_canvas.width, a_canvas.height)
  drawGrid(3, 20)
  drawTree(trueRoot, -1, 0, 0, 0, 0);
  return;
}

//Edgetrim functions
//All edgetrim functions are made by Rik Nietsch. All these functions are all functions that are called in computeEdgeTrim and computeEdgeTrim itself

function computeTrivialContour(node) {
  //this function sets the contour to the location of node
  // node.topleft = Object.create(node);
  // node.topright = Object.create(node);
  // node.midleft = Object.create(node);
  // node.midright = Object.create(node);
  // node.botleft = Object.create(node);
  //console.log('...');
  // node.botright = Object.create(node);
  //console.log('node.rikCoords.x_r',node.rikCoords.x_r);
  var contourpointList = ['topleft', 'topright', 'midleft', 'midright', 'botleft', 'botright'];
  for (var i in contourpointList) {
    var contourpoint = contourpointList[i];
    //console.log(contourpointList);
    //console.log(contourpoint);
    node[contourpoint] = {};
    //console.log(node[contourpoint]);
    node[contourpoint]['rikCoords'] = {
      'x_r': node.rikCoords.x_r,
      'y_r': node.rikCoords.y_r,
      'z_r': node.rikCoords.z_r,
      'dir': node.dir
    };
  }
  //console.log(node);
  //console.log(node.topleft);
  //console.log(node.topleft.rikCoords);
  // node.rikCoords.x_r = 'bla';
  //console.log('node:',node,node.rikCoords.x_r);
  //console.log('node.topleft:',node.topleft,node.topleft.rikCoords.x_r);
}

function directionBetweenNodes(r, r_s) {

  var direction_r_r_s;
  //console.log(r, r.parent, r.rikCoords);
  //console.log(r.rikCoords.y_r);
  //=========================================================================================================================================================
  //console.log(r_s, r.rikCoords);
  //console.log(r.rikCoords.y_r == r_s.rikCoords.y_r, r.rikCoords.x_r == r_s.rikCoords.x_r, (r.rikCoords.x_r - r.rikCoords.y_r) == (r_s.rikCoords.x_r - r_s.rikCoords.y_r))
  if (r.rikCoords.y_r == r_s.rikCoords.y_r) { //&& r.z == r_s.z
    if (r_s.rikCoords.x_r > r.rikCoords.x_r) {
      direction_r_r_s = 0;
    } else {
      direction_r_r_s = 3;
    }
  } else if (r.rikCoords.x_r == r_s.rikCoords.x_r) { //&& r.z == r_s.z
    if (r_s.rikCoords.y_r > r.rikCoords.y_r) {
      direction_r_r_s = 2;
    } else {
      direction_r_r_s = 5;
    }
  } else if ((r.rikCoords.x_r - r.rikCoords.y_r) == (r_s.rikCoords.x_r - r_s.rikCoords.y_r)) {
    //in this case r.z == r_s.z thus r.(x-y) == r_s.(x-y) thus r.x - r_s.x == r.y - r_s.y
    //to check if dir = 1 or 4, we can compare the x coords (y coords is also fine)
    if (r_s.rikCoords.x_r > r.rikCoords.x_r) { //then also r_s.rikCoords.y_r > r.rikCoords.y_r
      direction_r_r_s = 1;
    } else {
      direction_r_r_s = 4;
    }
  } else {
    //console.log(r_s, r, 'jhasfasjhfasfahsfhasfbkaksfbka')
    //console.log(r.rikCoords, r_s.rikCoords)
    //console.log(r_s.x, r_s.y, r_s.z)
  }
  return direction_r_r_s;
}

function findIntsect(dir, c) {
  //returns the intersection points that are cornerpoints of the contour of two contourlines not parallel to dir
  var intsect;
  if (dir == 0 || dir == 3) { // dir == x
    intsect = [c.midleft, c.midright];
  } else if (dir == 2 || dir == 5) { // dir == y
    intsect = [c.topright, c.botleft];
  } else if (dir == 1 || dir == 4) { // dir == z
    intsect = [c.topleft, c.botright];
    //console.log(c.topleft.rikCoords, c.botright.rikCoords);
  } else {
    //console.log('nkjnakakaskjaskjagkagbkasjk', dir)
  }
  return {
    intsect: intsect
  };
}

function distanceToContour(r, dir, c) { //here r is the parent of c and dir is an int
  // finds the minimum distance on the dir axis from a to the closest contourpart of node i
  //console.log(dir, c.midleft);
  //console.log(r.rikCoords, dir, c.rikCoords);
  //console.log(findIntsect(dir,c));
  var intsect_contour_0 = Object.create(findIntsect(dir, c).intsect[0]); //this is one of the points in which we switch contourparts
  //console.log('find...', findIntsect(dir,c).intsect[0].rikCoords);
  //console.log('intsect_contour_0', intsect_contour_0.rikCoords);
  //console.log('dit hoort gelijk te zijn:',findIntsect(dir,c).intsect[0].rikCoords, intsect_contour_0.rikCoords);
  var intsect_contour_1 = Object.create(findIntsect(dir, c).intsect[1]); //the other one
  //console.log('intsect_contour_1', intsect_contour_1.rikCoords);
  //console.log('dit hoort gelijk te zijn:',findIntsect(dir,c).intsect[1].rikCoords, intsect_contour_1.rikCoords);
  //transforming the dir int to the dir axis
  var r_coord_0 = dirIntToAxisParent(r, dir, intsect_contour_0);
  var r_coord_1 = dirIntToAxisParent(r, dir, intsect_contour_1);
  //console.log('r paulCoords:',r.x,r.y,r.z);
  //console.log('r rikCoords:',r.rikCoords);
  //console.log('c paulCoords:',c.x,c.y,c.z);
  //console.log('c rikCoords:',c.rikCoords);
  //console.log(dir);
  //console.log('intsect_contour_0.rikCoords',intsect_contour_0.rikCoords);
  var intsect_contour_0_coord = dirIntToAxisIntsect(intsect_contour_0, dir, r);
  //console.log('intsect_contour_0_coord:', intsect_contour_0_coord);
  var intsect_contour_1_coord = dirIntToAxisIntsect(intsect_contour_1, dir, r);
  //console.log('intsect_contour_1_coord:', intsect_contour_1_coord);
  var dist_to_intsect_0 = Math.abs(r_coord_0 - intsect_contour_0_coord);
  //console.log('dist_to_intsect_0:',dist_to_intsect_0);
  var dist_to_intsect_1 = Math.abs(r_coord_1 - intsect_contour_1_coord);
  //console.log('dist_to_intsect_1:',dist_to_intsect_1);
  var dist = Math.min(dist_to_intsect_0, dist_to_intsect_1); //picking the smallest of distances from a to intsect points furthest and closest by to a
  //console.log('distance', r.rikCoords, 'to closest contourpoint of',c.rikCoords, 'is',dist);
  return dist;
}

function dirIntToAxis(node, dir) { //here dir is an int
  //transforms the integer dir to the corresponding axis
  if (node === trueRoot) { //for the trueRoot the x,y,z in rikCoords are always 0
    return 0;
  }
  if (dir == 0 || dir == 3) { // dir == x
    //console.log(node, dir);
    return node.rikCoords.x_r;
  } else if (dir == 2 || dir == 5) { // dir == y
    return node.rikCoords.y_r;
  } else if (dir == 1 || dir == 4) { // dir == z
    //console.log(node.rikCoords.x_r);
    // return node.rikCoords.x_r; //in this case node.z and the node we are comparing with.z are equal thus we pick for this dir x (could also choose y)
    //old code: node.rikCoords.x_r - node.rikCoords.y_r;
    return node.rikCoords.x_r;
  }
}

function dirIntToAxisIntsect(intsect_contour_0, dir, r) {
  //transforms the integer dir to the corresponding axis
  if (intsect_contour_0 === trueRoot) { //for the trueRoot the x,y,z in rikCoords are always 0
    return 0;
  }
  if (dir == 0 || dir == 3) { // dir == x
    return intsect_contour_0.rikCoords.x_r;
  } else if (dir == 2 || dir == 5) { // dir == y
    return intsect_contour_0.rikCoords.y_r;
  } else if (dir == 1 || dir == 4) { // dir == z
    // return intsect_contour_0.rikCoords.x_r;
    if (Math.abs(intsect_contour_0.rikCoords.x_r - r.rikCoords.x_r) < Math.abs(intsect_contour_0.rikCoords.y_r - r.rikCoords.y_r)) {
      return intsect_contour_0.rikCoords.x_r;
    } else {
      return intsect_contour_0.rikCoords.y_r;
    }
  }
}

function dirIntToAxisParent(r, dir, intsect_contour_0) {
  //transforms the integer dir to the corresponding axis
  if (r === trueRoot) { //for the trueRoot the x,y,z in rikCoords are always 0
    return 0;
  }
  if (dir == 0 || dir == 3) { // dir == x
    return r.rikCoords.x_r;
  } else if (dir == 2 || dir == 5) { // dir == y
    return r.rikCoords.y_r;
  } else if (dir == 1 || dir == 4) { // dir == z
    if (Math.abs(intsect_contour_0.rikCoords.x_r - r.rikCoords.x_r) < Math.abs(intsect_contour_0.rikCoords.y_r - r.rikCoords.y_r)) {
      return r.rikCoords.x_r;
    } else {
      return r.rikCoords.y_r;
    }
  }
}

function distTwoContours(i, j, dir_r_i_r_j) {
  //console.log(i.rikCoords, j.rikCoords, dir_r_i_r_j);
  var intsect_i_0 = Object.create(findIntsect(dir_r_i_r_j, i).intsect[0]); //this is one of the points in which we switch contourparts
  var intsect_i_1 = Object.create(findIntsect(dir_r_i_r_j, i).intsect[1]); //the other point
  //transforming the dir int to the dir axis
  var intsect_i_0_coord;
  var intsect_i_1_coord;
  if (dir_r_i_r_j == 2 || dir_r_i_r_j == 5) { // dir == y then we have to compare two parallell z-lines thus we need the z = x - y coords
    intsect_i_0_coord = intsect_i_0.rikCoords.x_r - intsect_i_0.rikCoords.y_r;
    intsect_i_1_coord = intsect_i_1.rikCoords.x_r - intsect_i_1.rikCoords.y_r;
  } else {
    intsect_i_0_coord = dirIntToAxis(intsect_i_0, dir_r_i_r_j);
    intsect_i_1_coord = dirIntToAxis(intsect_i_1, dir_r_i_r_j);
  }
  var intsect_j_0 = Object.create(findIntsect(dir_r_i_r_j, j).intsect[0]); //this is one of the points in which we switch contourparts
  var intsect_j_1 = Object.create(findIntsect(dir_r_i_r_j, j).intsect[1]); //the other point
  //transforming the dir int to the dir axis
  var intsect_j_0_coord;
  var intsect_j_1_coord;
  if (dir_r_i_r_j == 2 || dir_r_i_r_j == 5) { // dir == y then we have to compare two parallell z-lines thus we need the z = x - y coords
    intsect_j_0_coord = intsect_j_0.rikCoords.x_r - intsect_j_0.rikCoords.y_r;
    intsect_j_1_coord = intsect_j_1.rikCoords.x_r - intsect_j_1.rikCoords.y_r;
  } else {
    intsect_j_0_coord = dirIntToAxis(intsect_j_0, dir_r_i_r_j);
    intsect_j_1_coord = dirIntToAxis(intsect_j_1, dir_r_i_r_j);
  }
  //console.log(intsect_i_0_coord, intsect_i_1_coord, intsect_j_0_coord, intsect_j_1_coord);
  // finding the 4 distances of combinations from 2 intsectpoints of i and 2 intsectpoints of j
  var dist_i_0_to_j_0 = Math.abs(intsect_i_0_coord - intsect_j_0_coord);
  var dist_i_0_to_j_1 = Math.abs(intsect_i_0_coord - intsect_j_1_coord);
  var dist_i_1_to_j_0 = Math.abs(intsect_i_1_coord - intsect_j_0_coord);
  var dist_i_1_to_j_1 = Math.abs(intsect_i_1_coord - intsect_j_1_coord);
  var dist = Math.min(dist_i_0_to_j_0, dist_i_0_to_j_1, dist_i_1_to_j_0, dist_i_1_to_j_1); //picking the smallest of the 4 distances
  //console.log(dist);
  return dist;
}

function moveNodeAndContour(node, dir, edgeTrim) {
  //moves the contour towards node.parent in direction dir by length edgeTrim
  //console.log(node.topleft.rikCoords);
  var contourpointList = [node.topleft, node.topright, node.midleft, node.midright, node.botleft, node.botright];
  //console.log(contourpointList);
  //console.logcontourpointList
  //updating the dir fields
  //console.log(node.rikCoords, dir, edgeTrim);
  if (dir == 0 || dir == 3) { // dir == x
    //node.rikCoords.x_r = 'blabla'; //testing
    node.dir = node.rikCoords.x_r;
    //console.log('should be the same',node.dir, node.rikCoords.x_r);
    //console.log(node.rikCoords, 'topleft:', node.topleft.rikCoords, 'botright:', node.botright.rikCoords);
    for (var contourpoint of contourpointList) {
      //console.log('contourpoint', contourpoint, contourpoint.dir, contourpoint.rikCoords.x_r);
      //contourpoint.rikCoords.x_r = 'bla';
      contourpoint.dir = contourpoint.rikCoords.x_r;
      //console.log('should be the same',contourpoint.dir, contourpoint.rikCoords.x_r);
      //console.log('should be the same coord x', contourpoint.dir, contourpoint.rikCoords.x_r);
    }
  } else if (dir == 2 || dir == 5) { // dir == y
    node.dir = node.rikCoords.y_r;
    for (contourpoint of contourpointList) {
      contourpoint.dir = contourpoint.rikCoords.y_r;
      //console.log('should be the same coord y', contourpoint.dir, contourpoint.rikCoords.y_r);
    }
  } else if (dir == 1 || dir == 4) { // dir == z
    //in this special case, z is constant, but x and y change
    node.dir = node.rikCoords.x_r; //take x_r here, we will adjust for y_r later
    for (contourpoint of contourpointList) {
      contourpoint.dir = contourpoint.rikCoords.x_r;
      //console.log('should be the same coord z', contourpoint.dir, contourpoint.rikCoords.x_r - contourpoint.rikCoords.y_r);
    }
  }
  //console.log('in moveNodeAndContour node.dir for node with rikCoords:',node.dir, node.rikCoords);
  //in case of z we will compare node.rikCoords.x_r with node.parent.rikCoords.x_r
  node.dir = dirIntToAxis(node, dir)
  node.parent.dir = dirIntToAxis(node.parent, dir)
  //console.log('contourpoints',node.topleft.rikCoords, node.topright.rikCoords, node.midleft.rikCoords, node.midright.rikCoords, node.botleft.rikCoords, node.botright.rikCoords);
  if (node.dir > node.parent.dir) {
    node.dir -= edgeTrim; //updating the node
    //updating the contour with lower dir coords
    for (contourpoint of contourpointList) {
      contourpoint.dir -= edgeTrim;
    }
    if (dir == 1 || dir == 4) { // dir == z
      //console.log('contourpoints',node.topleft.rikCoords, node.topright.rikCoords, node.midleft.rikCoords, node.midright.rikCoords, node.botleft.rikCoords, node.botright.rikCoords);
      node.rikCoords.y_r -= edgeTrim; //updating the node
      //console.log('contourpoints',node.topleft.rikCoords, node.topright.rikCoords, node.midleft.rikCoords, node.midright.rikCoords, node.botleft.rikCoords, node.botright.rikCoords);
      //updating the contour
      //======================================================================================================================================================
      for (contourpoint of contourpointList) {
        contourpoint.rikCoords.y_r -= edgeTrim;
      }
      node.rikCoords.y_r -= edgeTrim; //updating the node
      //console.log('contourpoints',node.topleft.rikCoords, node.topright.rikCoords, node.midleft.rikCoords, node.midright.rikCoords, node.botleft.rikCoords, node.botright.rikCoords);
    }
  } else { //node.dir < node.parent.dir
    //console.log('node.dir < node.parent.dir');
    node.dir += edgeTrim; //updating the node
    //updating the contour with higher dir coords
    for (contourpoint of contourpointList) {
      contourpoint.dir += edgeTrim;
    }
    if (dir == 1 || dir == 4) { // dir == z
      //console.log('y gets changed in case dir equals z');
      //console.log('node',node.rikCoords, '\n','contourpoints', node.topleft.rikCoords, node.topright.rikCoords, node.midleft.rikCoords, node.midright.rikCoords, node.botleft.rikCoords, node.botright.rikCoords);
      // updating the contour
      // =====================================================================================================================================================
      for (contourpoint of contourpointList) {
        contourpoint.rikCoords.y_r += edgeTrim;
      }
      //console.log('node',node.rikCoords, '\n','contourpoints', node.topleft.rikCoords, node.topright.rikCoords, node.midleft.rikCoords, node.midright.rikCoords, node.botleft.rikCoords, node.botright.rikCoords);
      node.rikCoords.y_r += edgeTrim; //updating the node
      // node.rikCoords.y_r = 'blabla';
      //console.log('node',node.rikCoords, '\n','contourpoints', node.topleft.rikCoords, node.topright.rikCoords, node.midleft.rikCoords, node.midright.rikCoords, node.botleft.rikCoords, node.botright.rikCoords);
    }
  }
  //console.log('contourpoints after moving y coords in case of dir is z',node.topleft.rikCoords, node.topright.rikCoords, node.midleft.rikCoords, node.midright.rikCoords, node.botleft.rikCoords, node.botright.rikCoords);
  //var r = node; //JUST FOR CONSOLE
  //console.log('contourpoints', r.topleft.rikCoords, r.topright.rikCoords, r.midleft.rikCoords, r.midright.rikCoords, r.botleft.rikCoords, r.botright.rikCoords);
  //now we will update the actual x,y,z coords using the dir fields
  if (dir == 0 || dir == 3) { // dir == x
    node.rikCoords.x_r = node.dir;
    for (contourpoint of contourpointList) {
      contourpoint.rikCoords.x_r = contourpoint.dir;
    }
  } else if (dir == 2 || dir == 5) { // dir == y
    node.rikCoords.y_r = node.dir;
    for (contourpoint of contourpointList) {
      contourpoint.rikCoords.y_r = contourpoint.dir;
    }
  } else if (dir == 1 || dir == 4) { // dir == z
    //we are already updated y_r, so only update x_r now
    node.rikCoords.x_r = node.dir;
    for (contourpoint of contourpointList) {
      contourpoint.rikCoords.x_r = contourpoint.dir;
    }
    //console.log(node.topleft.rikCoords);
  }
  //console.log('contourpoints at end of moveNodeAndContour',node.topleft.rikCoords, node.topright.rikCoords, node.midleft.rikCoords, node.midright.rikCoords, node.botleft.rikCoords, node.botright.rikCoords);
  //console.log('in moveNodeAndContour node.topleft.dir for node with rikCoords:',node.topleft.dir, node.rikCoords);
}

function mergeContourLines(r, c) {
  //merges the contourLines of r with contourLines of c
  //topmidLine, topleftLine and botleftLine should be the minimum of r and c
  if (c.topmidLine < r.topmidLine) {
    r.topmidLine = c.topmidLine;
  }
  if (c.topleftLine < r.topleftLine) {
    r.topleftLine = c.topleftLine;
  }
  if (c.botleftLine < r.botleftLine) {
    r.botleftLine = c.botleftLine;
  }
  //toprightLine, botrightLine and botmidLine should be the maximum of r and c
  if (c.toprightLine > r.toprightLine) {
    r.toprightLine = c.toprightLine;
  }
  if (c.botrightLine > r.botrightLine) {
    r.botrightLine = c.botrightLine;
  }
  if (c.botmidLine > r.botmidLine) {
    r.botmidLine = c.botmidLine;
  }
}

function contourPointsToLines(node) {
  //makes a field of the contourlines
  //console.log(node.topleft)
  //console.log(node)
  node.topmidLine = node.topleft.rikCoords.y_r;
  node.topleftLine = node.topleft.rikCoords.x_r;
  node.botleftLine = node.midleft.rikCoords.x_r - node.midleft.rikCoords.y_r;
  node.toprightLine = node.topright.rikCoords.x_r - node.topright.rikCoords.y_r;
  node.botrightLine = node.midright.rikCoords.x_r;
  node.botmidLine = node.botleft.rikCoords.y_r;
}

function contourLinesToPoints(r) {
  //updates the contourPoints by transforming them from lines to points
  //console.log(r.topleft);
  r.topleft.rikCoords = linesToPoint(r.topleftLine, 'x', r.topmidLine, 'y'); //we want the a_dir coords of a
  //console.log(r.topleft);
  //console.log(r.topleft.rikCoords);
  r.topright.rikCoords = linesToPoint(r.topmidLine, 'y', r.toprightLine, 'z');
  r.midleft.rikCoords = linesToPoint(r.topleftLine, 'x', r.botleftLine, 'z');
  r.midright.rikCoords = linesToPoint(r.toprightLine, 'z', r.botrightLine, 'x');
  r.botleft.rikCoords = linesToPoint(r.botleftLine, 'z', r.botmidLine, 'y');
  r.botright.rikCoords = linesToPoint(r.botmidLine, 'y', r.botrightLine, 'x');
}

function linesToPoint(a, a_dir, b, b_dir) {
  //IMPORTANT: z = x - y
  //calculates the intersection point between lines a and b

  //var x;
  //var y;
  if ((a_dir == 'x' || a_dir == 'y') && (b_dir == 'x' || b_dir == 'y')) { //some line x = ... and some line y = ...
    if (a_dir == 'x') {
      return {
        x_r: a,
        y_r: b,
      }
    } else {
      return {
        x_r: b,
        y_r: a,
      }
    }
  } else { //some line (x = ... or y = ...) and some line z = ...
    if (a_dir == 'x' || b_dir == 'x') { //some line x = ... and some line x - y = ...
      if (a_dir == 'x') { // a = x and b = x - y
        return {
          x_r: a,
          y_r: a - b, //b = x - y so y = x - b
        }
      } else { // a = x - y and b = x
        return {
          x_r: b,
          y_r: b - a, //a = x - y so y = x - a
        }
      }
    } else { //some line is y = ... and some line is x - y = ...
      if (a_dir == 'y') { // a = y and b = x - y
        return {
          x_r: a + b, //b = x -y
          y_r: a,
        }
      } else { // a = x - y and b = y
        return {
          x_r: a + b, //x = a + y
          y_r: b,
        }
      }
    }
  }
}

function computeEdgeTrim(r) {
  //console.log('r.edgeTrim at the beginning of the algo:',r.edgeTrim);
  computeTrivialContour(r); //set the contour of r to r itself
  //console.log('r.parent at the beginning of the algo',r.parent);
  for (var c of r.children) {
    //console.log('c in main algo', c.rikCoords, c.parent);
    //console.log(r.children, c);
    if (!(typeof(c.rikCoords) === 'number' && isNaN(c.rikCoords))) { //if rikCoords are set
      //console.log('als je dit ziet werkt de if rikCoords');
      //console.log('c in main algo',c.rikCoords);
      //c.linelength = computeCompactedEdgeLength(c);
      c.edgeTrim = computeEdgeTrim(c);
    }
    //for contour collection of r only look at r.children, since contours of descendants get merged with contours of r.children
  }
  //console.log('r.edgeTrim after recursing algo:',r.edgeTrim);
  for (var i of r.children) {
    //console.log(i.rikCoords);
    if (!(typeof(i.rikCoords) === 'number' && isNaN(i.rikCoords))) { //if rikCoords are set
      //console.log(i.rikCoords);
      for (var j of r.children) {
        if (!(typeof(j.rikCoords) === 'number' && isNaN(j.rikCoords))) { //if rikCoords are set
          //console.log(j.rikCoords, r, i);
          var dir_r_r_i;
          //console.log(r, i, j)
          dir_r_r_i = directionBetweenNodes(r, i); //i = r_i here dir is an int
          //console.log(dir_r_r_i)
          var dir_r_r_j = directionBetweenNodes(r, j); //j = r_j here dir is an int
          if (j.num > i.num) { //only comparing different children
            //console.log(i.num, j.num);
            var d_line_8 = distanceToContour(r, dir_r_r_i, i); //any point on (r,r_j) suffices since they all have the same dir_r_r_i coord
            //console.log('d_line_8 for child',i.rikCoords,'is', d_line_8);
            if (isNaN(r.edgeTrim)) {
              r.edgeTrim = d_line_8 - 1;
              //console.log('now egdeTrim should be d_line_8 - 1:',r.edgeTrim);
            }
            //console.log('r.edgeTrim after d8:', r.edgeTrim);
            if (d_line_8 - 1 < r.edgeTrim) {
              r.edgeTrim = d_line_8 - 1;
            }
            //console.log('r.edgeTrim after if d8 < edgeTrim:', r.edgeTrim);
            if (Math.abs(j.num - i.num) === 1) { //alpha = pi/3
              var dir_r_i_r_j = directionBetweenNodes(i, j); //here dir is an int
              var d_line_11 = distTwoContours(i, j, dir_r_i_r_j);
              //console.log(i.botleft.rikCoords, j.topright.rikCoords);
              //console.log('d_line_11 for children',i.rikCoords,j.rikCoords,'is', d_line_11);
              if (d_line_11 - 1 < r.edgeTrim) {
                r.edgeTrim = d_line_11 - 1;
              }
              //console.log('r.edgeTrim after d11:', r.edgeTrim);
            } else if (Math.abs(j.num - i.num) === 3) { //alpha = pi
              var dir_r_i_r_j = directionBetweenNodes(i, j); //here dir is an int
              var d_line_11 = distTwoContours(i, j, dir_r_i_r_j);
              //console.log('d_line_11 for calculating d_line_13 is', i.rikCoords, j.rikCoords, d_line_11);
              //console.log('topleft',trueRoot.children[0].children[3].topleft.rikCoords);
              //console.log(i.botright.rikCoords, j.topleft.rikCoords);
              //console.log(r.edgeTrim);
              var d_line_13 = Math.floor((d_line_11 - 1) / 2);
              //console.log('d_line_13 between',i.rikCoords,'and',j.rikCoords,'is', d_line_13);
              if (d_line_11 == 1 || d_line_11 == 2) {
                if (d_line_13 < r.edgeTrim) {
                  r.edgeTrim = d_line_13;
                }
              } else {
                if (d_line_13 - 1 < r.edgeTrim) {
                  r.edgeTrim = d_line_13 - 1;
                }
                //console.log(r.name,'r.edgeTrim after d13:', r.edgeTrim);
              }
            }
            //console.log(r.rikCoords, r.edgeTrim);
            //else {//alpha = 2pi/3
            // evt aanpassen na demo
            //continue;
            //}
          }
        }
      }
    }
  }
  //console.log('r.edgeTrim after d8, d11, d13:', r.edgeTrim);
  if (r.parent !== null) {
    for (var c of r.children) {
      if (!(typeof(c.rikCoords) === 'number' && isNaN(c.rikCoords))) { //if rikCoords are set
        //console.log(c.rikCoords);
        var dir_r_r_i = directionBetweenNodes(r, c); //here dir... is an int
        //var dir_r_r_parent = directionBetweenNodes(r,r.parent);
        //console.log(c.rikCoords, r.rikCoords, dir_r_r_i);
        var d_line_16 = distanceToContour(r, dir_r_r_i, c); //from (r,r_j) to i
        //console.log('d_line_16 is', d_line_16);
        if (isNaN(r.edgeTrim)) {
          r.edgeTrim = d_line_16 - 1;
        }
        if (d_line_16 - 1 < r.edgeTrim) {
          r.edgeTrim = d_line_16 - 1;
        }
        //console.log('r.edgeTrim after d16:', r.edgeTrim);
      }
    }
    //}
  }
  //console.log('r.edgeTrim after d8, d11, d13, d16:', r.edgeTrim);
  if (isNaN(r.edgeTrim)) {
    r.edgeTrim = 0;
  }
  //the d_line_19 part is already covered by the part for d_line_8, since no smaller dist than d_line_8 can be computed with d_line_19
  contourPointsToLines(r); //getting r ready for comparing contourLines to its children
  for (var c of r.children) {
    if (!(typeof(c.rikCoords) === 'number' && isNaN(c.rikCoords))) { //if rikCoords are set
      var direction_r_r_c = directionBetweenNodes(r, c);
      //console.log('edgeTrim before moving',r.edgeTrim);
      //======================================================================================================================================================
      //console.log('contourpoints of r before moving', r.topleft.rikCoords, r.topright.rikCoords, r.midleft.rikCoords, r.midright.rikCoords, r.botleft.rikCoords, r.botright.rikCoords);
      //console.log('contourpoints of c before moving', c.topleft.rikCoords, c.topright.rikCoords, c.midleft.rikCoords, c.midright.rikCoords, c.botleft.rikCoords, c.botright.rikCoords);
      moveNodeAndContour(c, direction_r_r_c, r.edgeTrim);
      //console.log('contourpoints of r after moving c and its contour', r.topleft.rikCoords, r.topright.rikCoords, r.midleft.rikCoords, r.midright.rikCoords, r.botleft.rikCoords, r.botright.rikCoords);
      //console.log('contourpoints of c after moving c and its contour', c.topleft.rikCoords, c.topright.rikCoords, c.midleft.rikCoords, c.midright.rikCoords, c.botleft.rikCoords, c.botright.rikCoords);
      contourPointsToLines(c); //getting c ready for comparing contourLines
      mergeContourLines(r, c); //only merges the lines of the contours
      //console.log('contourlines of', r.rikCoords, 'after merging with', c.rikCoords, ': ','\n', r.topmidLine, r.topleftLine ,r.botleftLine , r.toprightLine , r.botrightLine , r.botmidLine);
      contourLinesToPoints(r); //updates the contourPoints
      //console.log('contourpoints of', r.rikCoords, 'after merging with', c.rikCoords, ': ','\n', r.topleft.rikCoords, r.topright.rikCoords, r.midleft.rikCoords, r.midright.rikCoords, r.botleft.rikCoords, r.botright.rikCoords);
    }
  }
  //console.log('contourpoints of',r.rikCoords, 'after merging with all c if any', r.topleft.rikCoords, r.topright.rikCoords, r.midleft.rikCoords, r.midright.rikCoords, r.botleft.rikCoords, r.botright.rikCoords);
  //console.log('for r with rikCoords:', r.rikCoords, 'r.edgeTrim at the end of the algo:', r.edgeTrim);
  //console.log('r.edgeTrim after d8, d11, d13, d16 and if(isNaN):', r.edgeTrim);
  //console.log('linelength for',r.rikCoords,'before trimming',r.linelength)
  //r.linelength -= r.edgeTrim;
  return r.edgeTrim;
  //linelength;
}


window.visDataReady = data => {
  drawTree(data, -1, 0, 0, 0, 0);
  computeEdgeTrim(trueRoot);
  trimRedrawNodes(trueRoot);
  redrawTree();
};

// some trees to test with
// drawTree(parse('(A,B,(C,(D,E,F,G,H)I,J,K,L)M,N,(AA,BB,CC)O,(P,(Q,R,S,T,U)V,W,X,Y)Z)QQ;'), -1, 0, 0, 0, 0);
// drawTree(parse('(,K,,K,(Q,P)A,B,(C,(G)D)E)F;'), -1, 0, 0, 0, 0);
// drawTree(parse('(A,B,(C,(D,E,(S)F,G,H)I,J,K,L)M,N,(AA,BB,CC)O,(P,(Q,R,S,T,U)V,W,X,Y)Z)QQ;'), -1, 0, 0, 0, 0);
// drawTree(parse('(A,B,(C,(D,E,F,G,H)I,J,K,L)M,((GG,HH)DD,EE,FF)N,(AA,BB,CC)O,(P,(Q,R,S,T,U)V,W,X,Y)Z)QQ;'), -1, 0, 0, 0, 0);

// computeEdgeTrim(trueRoot);
// trimRedrawNodes(trueRoot);

function trimRedrawNodes(r) {
  doTrim(r, r.linelength - r.edgeTrim);
  if (r.children !== null) {
    for (var c of r.children) {
      if (!(typeof(c.rikCoords) === 'number' && isNaN(c.rikCoords))) { //if rikCoords are set
        trimRedrawNodes(c);
      }
    }
  }
}
// redrawTree();
