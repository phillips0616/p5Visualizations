var isDrawing = false;
var startx = -1;
var starty = -1;
var edges = []

function setup() {
    createCanvas(windowWidth, windowHeight);
  }
  
  function draw() {
    background(51)
    drawEdges();
    if (mouseIsPressed) {
      if(isDrawing) {
        line(startx, starty, mouseX, mouseY);
        stroke(255)
      } else {
          startx = mouseX;
          starty = mouseY;
          isDrawing = true;
      }
    } else {
        if(isDrawing) {
            edges.push({
                startx : startx,
                starty : starty,
                stopx : mouseX,
                stopy : mouseY
            })
            isDrawing = false;
        }
    }
  }

  function drawEdges() {
      for(i = 0; i < edges.length; i++) {
          line(edges[i].startx, edges[i].starty, edges[i].stopx, edges[i].stopy);
          stroke(255)
      }
  }