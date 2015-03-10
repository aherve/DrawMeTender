Drawer = function(canvasId){
  this.canvasId = canvasId;
  this.stroke = 10;
}

Drawer.prototype.setColor = function(color){
  this.color = color;
}

Drawer.prototype.init = function() {
  this.setColor("#000000")
  this.stage = new createjs.Stage(document.getElementById(this.canvasId));
  this.stage.addEventListener("stagemousedown", this.handleMouseDown());
  this.stage.addEventListener("stagemouseup", this.handleMouseUp());
  this.stage.autoClear = false;
  this.stage.enableDOMEvents(true);
  createjs.Touch.enable(this.stage);

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
    //color = colors[(index++) % colors.length];
    //stroke = Math.random() * 30 + 10 | 0;
    obj.oldPt = new createjs.Point(obj.stage.mouseX, obj.stage.mouseY);
    obj.oldMidPt = obj.oldPt.clone();
    obj.mouseMoveHandler = obj.handleMouseMove();
    obj.stage.addEventListener("stagemousemove", obj.mouseMoveHandler);
  }
}

Drawer.prototype.handleMouseMove = function() {
  var obj = this;
  return function(event){
    if (!event.primary) { return; }
    var midPt = new createjs.Point(obj.oldPt.x + obj.stage.mouseX >> 1, obj.oldPt.y + obj.stage.mouseY >> 1);
    obj.drawingCanvas.graphics.clear().setStrokeStyle(obj.stroke, 'round', 'round').beginStroke(obj.color).moveTo(midPt.x, midPt.y).curveTo(obj.oldPt.x, obj.oldPt.y, obj.oldMidPt.x, obj.oldMidPt.y);
    obj.oldPt.x    = obj.stage.mouseX;
    obj.oldPt.y    = obj.stage.mouseY;
    obj.oldMidPt.x = midPt.x;
    obj.oldMidPt.y = midPt.y;
    obj.stage.update();
  }
}

Drawer.prototype.handleMouseUp = function() {
  var obj = this;
  return function(event){
    if (!event.primary) { return; }
    obj.stage.removeEventListener("stagemousemove", obj.mouseMoveHandler);
  }
}

Drawer.prototype.clearDraw = function(){
  this.stage.clear();
}
