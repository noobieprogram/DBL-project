// Daan Hegger

// import 'd3';
import SunburstExt from 'sunburst-chart';

export default class SunBurst {

  constructor(root) {
    this.root = root;
    this.container = document.getElementById('vis1-container');
    this.draw();
    document.getElementById('usecolorssunburst').onchange = this.draw.bind(this);
    document.getElementById('uselabelssunburst').onchange = this.draw.bind(this);
  }

  draw() {
    this.container.innerHTML = '';
    let newData = convertTree(this.root);
    let myChart = SunburstExt();
    myChart.width(this.width);
    myChart.height(400);

    if (document.getElementById('usecolorssunburst').checked) {
      myChart.color((e) => e.color);
    }

    myChart.data(newData)(this.container);

    if (this.root.descendentsAmount > 100 || !document.getElementById('uselabelssunburst').checked) {
      document.getElementById('uselabelssunburst').checked = false;
      myChart.showLabels(false);
    }

  }

  get width() {
    return this.container.clientWidth - 40;
  }

  get height() {
    return this.container.clientHeight;
  }
}

function convertTree(node, color) {

  if (node.children.length == 0 || !node.children) {
    node.children = [];
  }

  let newChildren = [];
  let childrenColor = (function co(lor) {
    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 16)]) &&
      (lor.length == 6) ? lor : co(lor);
  })('');

  for (var i = 0; i < node.children.length; i++) {
    newChildren.push(convertTree(node.children[i], childrenColor));
  }

  return {
    name: node.name,
    children: newChildren,
    value: 1,
    color: color || 'white',
    amountSiblings: node.siblings.length
  };
}
