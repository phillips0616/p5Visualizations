var isDrawing = false;
var startx = -1;
var starty = -1;
var obstacle = null;
var adj = {}

function setup() {
    createCanvas(windowWidth, windowHeight);
    points = [
      {"x": 30, "y" : 50},
      {"x": 30, "y" : 200},
      {"x": 200, "y" : 200},
      {"x": 200, "y": 50}
    ]
    obstacle = new Obstacle(points);
    lines = obstacle.getLines();
    console.log(lines);

    for(i = 0; i < lines.length; i++) {
      line(lines[i].startx, lines[i].starty, lines[i].stopx, lines[i].stopy)
    }
}

function mouseClicked() {
  console.log(obstacle.isCollision(mouseX, mouseY))
  ellipse(mouseX, mouseY, 5, 5)
}
  
function draw() {

}

// [{x,y},...]
function Obstacle(vertices) { 
  this.vertices = vertices;
  this.lines = [];
  this.getVertices = function() {
    return this.vertices;
  }

  this.getLines = function() {
    if(this.lines != null && this.lines.length > 0) {
      return this.lines;
    }

    for(i = 1; i < this.vertices.length; i++) {
      let slope = calculateSlope(this.vertices[i].x, this.vertices[i].y, this.vertices[i - 1].x, this.vertices[i - 1].y)
      let yinter = calculateYIntercept(this.vertices[i].x, this.vertices[i].y, slope);
      console.log(this.vertices[i-1])
      console.log(this.vertices[i])
      this.lines.push({
        "startx": this.vertices[i-1].x,
        "starty": this.vertices[i-1].y,
        "stopx" : this.vertices[i].x,
        "stopy" : this.vertices[i].y,
        "slope" : slope,
        "yinter": yinter
      })
    }
    let slope = calculateSlope(this.vertices[0].x, this.vertices[0].y, this.vertices[this.vertices.length - 1].x, this.vertices[this.vertices.length - 1].y)
    let yinter = calculateYIntercept(this.vertices[0].x, this.vertices[0].y, slope);
    this.lines.push({
      "startx": this.vertices[this.vertices.length - 1].x,
      "starty": this.vertices[this.vertices.length - 1].y,
      "stopx" : this.vertices[0].x,
      "stopy" : this.vertices[0].y,
      "slope" : slope,
      "yinter": yinter 
    });
    return this.lines;
  }
  //I need to look on the correct side of the polygon.
  //if the line slanted the slope will take care of it,
  //but if the line is vertical or horizontal I need to look at 
  //the previous point to determine what side of the polygon I 
  //should consinder "inside".
  this.isCollision = function(x,y) {
    let prevX = -Infinity
    let prevY = -Infinity
    for(i = 0; i < this.lines.length; i++) {
      let yinter = this.lines[i].yinter;
      let slope = this.lines[i].slope;
      console.log("checking collision for ("+ mouseX + "," + mouseY + ")"  );
      console.log(prevX)
      console.log(prevY)
      console.log(this.lines[i]);
      if(slope == 0 || slope == Infinity) {
        if(prevX == -Infinity && prevY == -Infinity) {
          if(this.lines[i].startx == this.lines[i].stopx) {
            if(x < this.lines[i].stopx) {
              console.log("1")
              return false;
            }
          } else if(this.lines[i].starty == this.lines[i].stopy) {
            if(y < this.lines[i].starty) {
              console.log("2")
              return false;
            }
          }
          prevX = this.lines[i].startx
          prevY = this.lines[i].starty
        } else {
          if(this.lines[i].startx == this.lines[i].stopx) {
            if(this.lines[i].stopy > prevY) {
              if(x < this.lines[i].stopx) {
                console.log("3")
                return false;
              }
            } else if (this.lines[i].stopy < prevY) {
              if(x > this.lines[i].stopx) {
                console.log("4")
                return false;
              }
            }
            prevX = this.lines[i].startx
            prevY = this.lines[i].starty
          } else if(this.lines[i].starty == this.lines[i].stopy) {
              if(prevY > this.lines[i].stopy && y < this.lines[i].stopy) {
                console.log("5")
                return false;
              } else if(prevY < this.lines[i].stopy && y > this.lines[i].stopy) {
                console.log("6")
                return false;
              }
              prevX = this.lines[i].startx;
              prevY = this.lines[i].starty;
          }
        }
      } else if(slope*x + yinter - y > 0) {
        console.log("calculating slope of slanted line");
        return false;
      }
    }
    return true;
  }
}

function calculateSlope(startx, starty, stopx, stopy) {
  let changey = stopy - starty;
  let changex = stopx - startx;

  if(changey == 0) {
    return 0;
  }

  if(changex == 0) {
    return Infinity;
  }

  return changey / changex;
}

function calculateYIntercept(x,y,slope) {
  if(slope == Infinity) {
    return null;
  }

  return y - x*slope;
}