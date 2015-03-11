Messages = new Mongo.Collection("messages");

Meteor.methods({
  postMsg: function(text){
    Messages.insert({
      text: text,
      authorName: Meteor.user().profile.name,
      authorId: Meteor.user()._id,
      createdAt: new Date()
    })
  }
})
