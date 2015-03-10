Meteor.subscribe("messages")

Template.chat.helpers({
  messages: function(){
    return Messages.find({}, {sort: {'createdAt': -1}});
  },

  messagesCount: function(){
    return Messages.find({}).count();
  }

})

Template.chat.events({
  "submit .new-message": function(event){
    console.log("haha");
    var text = event.target.text.value;
    Meteor.call("postMsg", text);
    event.target.text.value = "";
    return false;
  }
})
