Drawer = function(canvasId){
  this.canvasId = canvasId;
  this.stroke = 10;
}

Drawer.prototype.setColor = function(color){
  this.color = color;
}

Drawer.prototype.init = function() {
  this.lines = [];
  this.setColor("#000000")
  this.stage = new createjs.Stage(document.getElementById(this.canvasId));
  this.stage.addEventListener("stagemousedown", this.handleMouseDown());
  this.stage.addEventListener("stagemouseup", this.handleMouseUp());
  this.stage.autoClear = false;
  this.stage.enableDOMEvents(true);
  createjs.Touch.enable(this.stage);
  createjs.Ticker.setFPS(24);

  this.drawingCanvas = new createjs.Shape();

  this.title = new createjs.Text("Click and Drag to draw", "36px Arial", "#777777");
  this.title.x = 300;
  this.title.y = 200;
  this.stage.addChild(this.title);
  this.stage.addChild(this.drawingCanvas);
  this.stage.update();
}

Drawer.prototype.handleMouseDown = function() {
  var obj = this;
  return function(event){
    if (!event.primary) { return; }
    if (obj.stage.contains(obj.title)) {
      obj.stage.clear();
      obj.stage.removeChild(obj.title);
    }

    startPoint = new createjs.Point(obj.stage.mouseX, obj.stage.mouseY);
    obj.currentLine = new Drawer.line(obj.color,startPoint);

    obj.mouseMoveHandler = obj.handleMouseMove();
    obj.stage.addEventListener("stagemousemove", obj.mouseMoveHandler);
  }
}

Drawer.prototype.handleMouseUp = function() {
  var obj = this;
  return function(event){
    if (!event.primary) { return; }
    obj.stage.removeEventListener("stagemousemove", obj.mouseMoveHandler);
    obj.lines.push(obj.currentLine);
  }
}

Drawer.prototype.handleMouseMove = function() {
  var obj = this;
  return function(event){
    if (!event.primary) { return; }
    var pt = new createjs.Point(obj.stage.mouseX, obj.stage.mouseY)
    obj.currentLine.points.push(pt);
    obj.drawLine(obj.currentLine);
  }
}

Drawer.prototype.drawLine = function(line){
  var obj = this;
  line.points.slice(1,line.points.length).reduce(function reducer(r,pt){
    obj.drawingCanvas.graphics.clear().setStrokeStyle(obj.stroke, 'round', 'round').beginStroke(line.color).moveTo(r.x, r.y).curveTo(r.x,r.y, pt.x, pt.y);
    obj.stage.update();
    return pt;
  }, line.points[0])
}

Drawer.prototype.draw = function(){
  obj = this;
  obj.lines.map(function(line){
    return obj.drawLine(line);
  })
}

Drawer.prototype.clearDraw = function(){
  this.stage.clear();
}
