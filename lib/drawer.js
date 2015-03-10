Lines = new Mongo.Collection("lines");

ClearInstructions = new Mongo.Collection("clearInstructions")

if (Meteor.isServer) {
  Meteor.publish("lines", function(){
    return Lines.find({});
  })
  Meteor.publish("clearInstructions", function(){
    return ClearInstructions.find({});
  })
}

Meteor.methods({
  saveLine: function(line){
  if (typeof line != 'undefined' && line.points != 'undefined' && line.points.length > 0){
    Lines.insert(line);
  }
return false;
  },
  clearLines: function(){
    Lines.remove({});
    ClearInstructions.remove({});
    ClearInstructions.insert({
      date: new Date()
    })
  },

})

Drawer = function(canvasId,lines){
  this.canvasId = canvasId;
  this.stroke = 8;
  this.lines = lines || [];
}

Drawer.prototype.setColor = function(color){
  this.color = color;
}

Drawer.prototype.init = function() {
  this.setColor("#000000");
  this.stage = new createjs.Stage(document.getElementById(this.canvasId));
  this.stage.addEventListener("stagemousedown", this.handleMouseDown());
  this.stage.autoClear = false;
  this.stage.enableDOMEvents(true);
  createjs.Touch.enable(this.stage);
  createjs.Ticker.setFPS(24);

  this.drawingCanvas = new createjs.Shape();

  //if (this.lines.length <= 0){

  //  this.title = new createjs.Text("Click and Drag to draw", "36px Arial", "#777777");
  //  this.title.x = 300;
  //  this.title.y = 200;
  //  this.stage.addChild(this.title);
  //}

  this.stage.addChild(this.drawingCanvas);
  this.stage.update();

  this.draw();
}

Drawer.prototype.handleMouseDown = function() {

  var obj = this;
  return function(event){
  //just in case
  obj.stage.removeEventListener("stagemousemove", obj.mouseMoveHandler);
  obj.stage.removeEventListener("stagemouseup", obj.mouseUpHandler);

    if (!event.primary) { return; }
    //if (obj.stage.contains(obj.title)) {
    //  obj.stage.clear();
    //  obj.stage.removeChild(obj.title);
    //}

    startPoint = new createjs.Point(obj.stage.mouseX, obj.stage.mouseY);
    obj.currentLine = new Drawer.line(obj.color,startPoint);

    obj.mouseMoveHandler = obj.handleMouseMove();
    obj.stage.addEventListener("stagemousemove", obj.mouseMoveHandler);

    obj.mouseUpHandler = obj.handleMouseUp();
    obj.stage.addEventListener("stagemouseup", obj.mouseUpHandler);
  }
}

Drawer.prototype.handleMouseUp = function() {
  var obj = this;
  return function(event){
    if (!event.primary) { return; }
    obj.addLine(obj.currentLine);
    obj.stage.removeEventListener("stagemousemove", obj.mouseMoveHandler);
    obj.stage.removeEventListener("stagemouseup", obj.mouseUpHandler);
  }
}

Drawer.prototype.handleMouseMove = function() {
  var obj = this;
  return function(event){
    if (!event.primary) { return; }
    var pt = new createjs.Point(obj.stage.mouseX, obj.stage.mouseY);
    var old = obj.currentLine.points.slice(-1)[0]
    if (pt.x != old.x || pt.y != old.y){
      obj.currentLine.points.push(pt);
      obj.drawLine(obj.currentLine);
    }

    if (obj.currentLine.points.length > 0 && (obj.currentLine.points.length % 10) == 0) {
      obj.addLine(obj.currentLine);
      obj.currentLine = new Drawer.line(obj.color, pt);
    } 
  }
}

Drawer.prototype.addLine = function(line){
  Meteor.call("saveLine", line)
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
  obj.drawed_at = new Date();
}

Drawer.prototype.clearDraw = function(){
  this.stage.clear();
  Meteor.call("clearLines");
}
