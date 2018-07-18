//Abdullah, Daan and Matthijs

export default class Tree {

  constructor(root) {
    this.root = root;
    this.draw();
  }

  draw() {
    //Abdullah, Daan and Matthijs
    const cThis = this;

    function dist(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }


    let canvas = document.getElementById('tree');
    canvas.width = canvas.parentNode.clientWidth - 40;
    let ctx = canvas.getContext('2d');
    let backRGB = document.getElementById('backColor').value;
    let treeRGB = document.getElementById('treeColor').value;

    //initial color calls
    ctx.fillStyle = backRGB;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    class Branch {
      // This function creates a branch
      constructor(x, y, newX, newY, level) {
        this.x = x;
        this.y = y;
        this.newX = newX;
        this.newY = newY;
        this.level = level;
        this.color = treeRGB;
        ctx.lineWidth = '2';
        this.hovered = false;
      }

      // Determine if the branch is hovered by the mouse
      // Using the distance from point to line formula from mathmatics
      // @return boolean
      isHovered(mouseX, mouseY) {
        // First calculate slope of linear equation

        let d1 = dist(mouseX, mouseY, this.x, this.y);
        let d2 = dist(mouseX, mouseY, this.newX, this.newY);
        let lineLength = dist(this.x, this.y, this.newX, this.newY);

        return Math.abs(d1 + d2 - lineLength) < this.lineWidth * 0.7;

      }

      colorchanger() {
        let w = hexToRgb(this.color);
        w.r = Math.floor(w.r * (Math.sqrt(this.level + 1) / 1.4));
        w.g = Math.floor(w.g * (Math.sqrt(this.level + 1) / 1.4));
        w.b = Math.floor(w.b * (Math.sqrt(this.level + 1) / 1.4));
        this.color = 'rgb(' + w.r + ',' + w.g + ',' + w.b + ')';
      }

      render() {
        let w = this.color.split('');
        if (w[8] == undefined) {
          this.colorchanger();
        }
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.newX, this.newY);
        ctx.stroke();

        // ctx.fillStyle = '#FF0000'
        // ctx.fillRect(this.x, this.y, 1, 1);


        if (this.hovered) {
          this.renderText();
        }
      }

      get lineWidth() {
        return lineThicc / (this.level + 1);
      }

      renderText() {
        ctx.fillStyle = '#FF0000';
        this.textSize();
        ctx.fillText(this.name || 'no-name', (this.x + this.newX) / 2, (this.y + this.newY) / 2);
      }

      textSize() {
        let size = 10 * (Math.pow(Math.E, -0.045 * this.level));
        ctx.font = size + 'px Arial';
      }

      onHoverIn() {
        this.hovered = true;
        this.color = 'rgb(0, 219, 15)';
      }

      onHoverOut() {
        this.hovered = false;
        this.color = treeRGB;
      }
    }

    document.getElementById('backColor').onchange = function() {
      backRGB = this.value;
      ctx.fillStyle = backRGB;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      redraw();
      // for (var i = 0; i < branches.length; i++) {
      //   branches[i].render();
      // }
    };
    document.getElementById('treeColor').onchange = function() {
      treeRGB = this.value;
      for (var i = 0; i < branches.length; i++) {
        branches[i].color = treeRGB;
      }
      redraw();
    };

    //RGB changers
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    function clearCanvas() {
      ctx.fillStyle = backRGB;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Array for all branches
    let branches = [];

    const baseLength = 150;
    const lengthGrow = 0.67;
    const lineThicc = 15;

    // The recursive function to draw the full tree
    function branch(x, y, prevAngle, fraction, level, node) {
      // Dont draw children of leaves obviously
      if (!node)
        return;

      // Compute the new (global) angle based on the angle of the parent branches
      // First take the parents angle. Then subtract 90 degrees (0.5 PI) to get to the left perpendicular point.
      // Then Add the fraction to evenly spread the children
      let newAngle = prevAngle - Math.PI / 2 + fraction * Math.PI;

      let len = baseLength * Math.pow(lengthGrow, level);

      // Simple step: Just compute new (global) coordinates based on the new computed angle
      let newX = x + Math.cos(newAngle) * len;
      let newY = y - Math.sin(newAngle) * len;


      // Create a instance of an object instead of direct rendering, this way it is easier to scale the visualisation with interactions
      let b = new Branch(x, y, newX, newY, level);

      // Set the name of the branch based on the original name of the given dataset
      b.name = node.name;
      b.len = len;
      b.dataOrigin = node;

      // Push it to the array of all branches, this way we can render them all using one for loop
      // To render individual branches, call branch.render()
      branches.push(b);

      // Initiate the recusive call for all children
      for (let i = 0; i < node.children.length; i++) {
        branch(
          newX,
          newY,
          newAngle, // The parents angle is the base angle for the children, they compute their angle offsetted by their parent
          (i + 1) / (node.children.length + 1), // Every child is placed on a fraction of a half circle. If there is only on child its fraction is 1/2 because it should be centered in the middle
          level + 1, // Level of depth in the tree
          node.children[i] // Parse the actual child

        );
      }

    }
    // Initual call
    branch(
      canvas.width / 2, // Start at center of screen width
      canvas.height, // Start at bottom of screen height
      Math.PI / 2, // Initial angel, 90 degrees standing upright
      0.5, // Initial fraction: 1/2 because it should be standing up in the middle
      0, // Initial length
      cThis.root // Root of dataset
    );

    //Initial render
    for (let i = 0; i < branches.length; i++) {
      branches[i].render();
    }

    // Loop through all branches and render them
    // Register a mousemove to detect hover above branches

    function redraw(e) {
      clearCanvas();
      if (!e) {
        e = false;
      }

      for (let i = 0; i < branches.length; i++) {
        branches[i].onHoverOut();
      }

      for (let i = 0; i < branches.length; i++) {
        let rect = canvas.getBoundingClientRect();
        if (e) {
          if (branches[i].isHovered(e.clientX - rect.left, e.clientY - rect.top)) {
            branches[i].onHoverIn();
            break;
          }
        }
      }
      for (let i = 0; i < branches.length; i++) {
        branches[i].render();
      }
    }
    canvas.onmousemove = redraw;

    var ctrlvar = 0;
    canvas.onclick = (e) => {
      for (let i = 0; i < branches.length; i++) {
        let rect = canvas.getBoundingClientRect();
        if (branches[i].isHovered(e.clientX - rect.left, e.clientY - rect.top)) {
          let b = branches[i];
          clearCanvas();
          if (branches[0].dataOrigin == b.dataOrigin) {
            finddaddy(b.dataOrigin);
            clearCanvas();
          } else {
            branches = [];
            branch(
              canvas.width / 2, // Start at center of screen width
              canvas.height, // Start at bottom of screen height
              Math.PI / 2, // Initial angel, 90 degrees standing upright
              1 / 2, // Initial fraction: 1/2 because it should be standing up in the middle
              0, // Initial length
              b.dataOrigin, // New Root of dataset
              15
            );
          }
          for (let i = 0; i < branches.length; i++) {
            branches[i].render();
          }
          break;
        }
      }
      if (ctrlvar == 1) { //when ctrl is pressed reset the tree
        ctrlvar = 0; //reset ctrl value
        clearCanvas();
        branches = []; //reset branches array
        branch(
          canvas.width / 2, // Start at center of screen width
          canvas.height, // Start at bottom of screen height
          Math.PI / 2, // Initial angel, 90 degrees standing upright
          0.5, // Initial fraction: 1/2 because it should be standing up in the middle
          0, // Initial length
          cThis.root, // Root of dataset
          15
        );
        for (let i = 0; i < branches.length; i++) {
          branches[i].render(); //render the branches
        }
      }
    }


    //check if ctrl is pressed
    document.addEventListener('keydown', function(event) {
      if (event.keyCode == 17 || event.keyCode == 91 || event.keyCode == 224) {
        ctrlvar = 1;
      }
    }, true);

    function finddaddy(origin) {
      if (!origin.parent) {
        return;
      }
      branches = [];
      branch(
        canvas.width / 2, // Start at center of screen width
        canvas.height, // Start at bottom of screen height
        Math.PI / 2, // Initial angel, 90 degrees standing upright
        0.5, // Initial fraction: 1/2 because it should be standing up in the middle
        0, // Initial length
        cThis.root, // Root of dataset
        15
      );
      for (let i = 0; i < branches.length; i++) {
        if (branches[i].dataOrigin == origin) {
          for (let j = 0; j < i; j++) {
            if (branches[i].x == branches[j].newX) {
              console.log('hello');
              let b = branches[j];
              branches = [];
              branch(
                canvas.width / 2, // Start at center of screen width
                canvas.height, // Start at bottom of screen height
                Math.PI / 2, // Initial angel, 90 degrees standing upright
                0.5, // Initial fraction: 1/2 because it should be standing up in the middle
                0, // Initial length
                b.dataOrigin, // New Root of dataset
                15
              );
              break;
            }
          }
          break;
        }
      }
    }
  }

}
