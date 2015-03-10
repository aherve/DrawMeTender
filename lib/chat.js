Messages = new Mongo.Collection("messages");

Meteor.methods({
  postMsg: function(text){
    Messages.insert({
      text: text,
      createdAt: new Date()
    })
  }
})
