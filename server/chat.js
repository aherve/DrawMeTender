Meteor.publish("messages", function(){
  return Messages.find({}, {sort: {createdAt: -1}, limit: 10});
})

Meteor.methods({
  postMsg: function(text){

    if (Meteor.user()){
      Messages.insert({
        text: text,
      authorName: Meteor.user().profile.name,
      authorId: Meteor.user()._id,
      createdAt: new Date()
      })
    }
  }
})
