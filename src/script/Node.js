// Pieter Jacobs

export default class Node {

  constructor(name, parent, children) {
    this.parent = parent;
    this.children = children;
    this.name = name;
    this.shown = true;

    this.num = NaN
    this.dir = NaN
    this.rikCoords = NaN
    this.linelength = 1
    this.linelength2 = null
    this.edgeTrim = NaN
    this.depth
    this.color = '#FF0000'
  }

  get childrenAmount() {
    if (!this.children) {
      this.children = [];
    }
    return this.children.length;
  }

  get descendentsAmount() {
    if (!this.children) {
      this.children = [];
    }

    var tmp = 0;
    for (var child of this.children) {
      tmp += child.descendentsAmount + 1;
    }
    return tmp;
  }

  get height() {
    var max = 0;
    for (var child of this.children) {
      max = Math.max(max, child.height + 1);
    }
    return max;
  }

  get siblings() {
    if (this.parent) {
      return this.parent.children;
    } else {
      return [];
    }
  }

  get meanHeight() {
    var mean = this.height;
    for (var child of this.children) {
      mean += child.meanHeight * (child.descendentsAmount + 1);
    }
    return mean / (this.descendentsAmount + 1);
  }

}
