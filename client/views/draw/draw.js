Template.draw.events({
  "click .clear": function(){
    draw.clearDraw();
    }
})

Template.draw.rendered = function(){
  draw = new Drawer('myCanvas');
  draw.init();
}

