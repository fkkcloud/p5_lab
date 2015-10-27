
/* edge property */
var p1, p2
var points= [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
var s = 0;
var d = new Date(); /* except */
var line_start_millisec = d.getTime() + 1000;

function setup() {
  /* test value */
  p1 = createVector(100, 240, 0);
  p2 = createVector(300, 120, 0);
  smooth(10);
  frameRate(60);
}

function draw() {
  createCanvas(400, 400);
  background(100);
  noStroke();
  fill(200, 250, 250);
  ellipse(p1.x, p1.y, 10, 10);
  ellipse(p2.x, p2.y, 10, 10);
  //ellipse(p3.x, p3.y, 10, 10);
  
  /* so for loop of the each edge can go here */
  drawEdge(p1, p2, points.length, points, line_start_millisec, 1);
}

/*
  @start              - start position
  @end                - end position
  @lines_mem          - to store the line information per edge traffics
  @start_milli_sec    - when it will start to draw line - trigger in milliseconds
  @line_type 1        - solid, 
             0        - dashed
*/
function drawEdge(start, end, num_lines, lines_mem, start_milli_sec, line_type) {
  var d = new Date();
  var now = d.getTime();
  
  if (now < start_milli_sec)
    return;
    
  var t1, t2, t3;
  var line_type_var = !line_type ? 2.5 : 1;
  
  if (s <= 1) {
    s+=0.01 * 1;
  }
  
  for (var line_id = 0; line_id < num_lines; line_id++){
    var curveHelpPoint = getCurvePoint(p1, p2, 200 + line_id * 20, true);
    t1 = p5.Vector.lerp(start, curveHelpPoint, s);
    t2 = p5.Vector.lerp(curveHelpPoint, end, s);
    t3 = p5.Vector.lerp(t1, t2, s);
    lines_mem[line_id].push(t3);
    
    
    for (var i=0; i < lines_mem[line_id].length; i++) {
      if (line_type){
          noFill();
          stroke(0, 150, 150, 100);
          strokeWeight(line_type_var);
          
          beginShape();
          vertex(start.x, start.y);
          bezierVertex(t1.x, t1.y, t3.x, t3.y, t3.x, t3.y);
          vertex(t3.x, t3.y);
          endShape();
      }else {
        noFill();
        stroke(200, 150, 200, 200);
        strokeWeight(line_type_var);
        var mod = i % 4;
        if (mod === 0 && i > 0 && i < lines_mem[line_id].length -1) {
          line(lines_mem[line_id][i-1].x, lines_mem[line_id][i-1].y, lines_mem[line_id][i].x, lines_mem[line_id][i].y);
        }
        else if (i === 0 || i === lines_mem[line_id].length -1) {
          point(lines_mem[line_id][i].x, lines_mem[line_id][i].y);
        }
      }
      
    }
  }
}

/*
@p1 - start position
@p2 - end position
@height - how far it will be away from the ground vector
@direction - whether it will go up or down from the ground vector
*/
function getCurvePoint(p1, p2, height, direction) {
  var side = direction < 1 ? 1 : -1;
  
  var midPoint = createVector((p1.x + p2.x) * 0.5, (p1.y + p2.y) * 0.5, 0);
  
  var groundVector  = createVector(p1.x-p2.x, p1.y-p2.y, 0);
  groundVector.normalize();
  
  var upVector = createVector(0, 0, 1);
  
  var resVector = p5.Vector.cross(groundVector, upVector);
  resVector.mult(height * side);
  
  return p5.Vector.add(resVector, midPoint);
}
