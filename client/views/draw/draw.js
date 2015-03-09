Template.draw.events({
  "click .clear": function(){
    draw.clearDraw();
  },
  "click .setColor": function(event,t){
    var col = event.currentTarget.value;
    draw.setColor(col);
  }
})

Template.draw.rendered = function(){
  draw = new Drawer('myCanvas');
  draw.init();
}

Template.draw.helpers({
  "colors": [
{value: "#000000"},
{value: "#828b20"},
{value: "#b0ac31"},
{value: "#cbc53d"},
{value: "#fad779"},
{value: "#faf2db"},
{value: "#563512"},
{value: "#9b4a0b"},
{value: "#d36600"},
{value: "#fe8a00"},
{value: "#f9a71f"}
]
})
