Meteor.subscribe("lines")
Meteor.subscribe("clearInstructions")

Template.draw.events({
  "click .clear": function(){
    draw.clearDraw();
  },
  "click .setColor": function(event,t){
    var col = event.currentTarget.value;
    draw.setColor(col);
  }
})

Template.draw.helpers({
  lines: function(){
    return Lines.find({})
  },

  linesCount: function(){
    return Lines.find({}).count();
  }

})

Template.draw.rendered = function(){

  $("#myCanvas").width('90%');

  draw = new Drawer('myCanvas');
  draw.init();
}

Tracker.autorun(function(){
  lines = Lines.find().fetch();
  if (typeof draw == 'undefined'){
    draw = new Drawer('myCanvas',lines);
  }

  ci = ClearInstructions.findOne({},{sort: {createdAt: -1}});
  ra = draw.drawed_at;
  if (!(typeof ci == 'undefined')) {
    if (typeof ra == 'undefined' || ci.date >= ra){
      draw.clearDraw();
    }
  }

  draw.lines = lines;
  draw.draw();
})

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
{value: "#f9a71f"},
{value: "#ffffff"},
]
})
