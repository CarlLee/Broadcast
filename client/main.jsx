DEBUG = false;


$(document).ready(function(){
    React.render(
        <BroadcastList/>,
        document.querySelector('.body')
    );
});


// Template.body.onCreated(function(){
//     Meteor.subscribe('broadcasts');
// });

Template.body.helpers({
    'user' : function(){
        return Meteor.user();
    },
//     'broadcasts': function(){
//         return Broadcasts.find({}, {
//             transform: function(doc){
//                 doc.expanded = new ReactiveVar(false);
//                 doc.lastRead = new ReactiveVar(0);
//                 doc.replies = Replies.find({'broadcastId' : doc._id}, {
//                     sort: { created:1 }
//                 });
//                 doc.toggleExpanded = function(){
//                     var expanded = this.expanded.get();
//                     this.expanded.set(!expanded);
//                 }
//                 return doc;
//                 // return Broadcast.wrap(doc);
//             }
//         });
//     }
});

// Template.body.events({
//     'click #new-post' : function(e){
//         e.preventDefault();
//         e.stopImmediatePropagation();

//         $('.new-post-box-wrapper').addClass('shown');
//     },
//     'click #cancel-new-post' : function(e){
//         e.preventDefault();
//         e.stopImmediatePropagation();

//         $('.new-post-box-wrapper').removeClass('shown');
//     },
//     'submit #new-post-form' : function(e){
//         e.preventDefault();

//         var title = e.target.title.value;
//         var content = e.target.content.value;
//         Meteor.call('addBroadcast', {
//             title: title,
//             content: content
//         });

//         e.target.title.value = '';
//         e.target.content.value = '';
//         $('.new-post-box-wrapper').removeClass('shown');
//     }
// });

// Template.broadcast.helpers({
//     'myself' : function(){
//         return Meteor.user();
//     },
//     'expanded' : function(){
//         return this.expanded.get();
//     },
//     'owner' : function(){
//         return Meteor.users.findOne(this.ownerId);
//     },
//     'newUnread' : function(){
//         return this.lastRead.get() < this.replies.count();
//     },
//     'replies' : function(){
//         return this.replies;
//     }
// });

// Template.broadcast.events({
//     'click .broadcast-content' : function(e, template){
//         e.preventDefault();
//         e.stopImmediatePropagation();
//         this.toggleExpanded();
//         var count = this.replies.count();
//         this.lastRead.set(count);
//     },
//     'click .info #upvote' : function(e){
//         e.preventDefault();
//         e.stopImmediatePropagation();
//         console.log('click .info #upvote');
//         // console.log(parentData);
//         Meteor.call('upvoteBroadcast', this._id);
//     },
//     'click .info #downvote' : function(e){
//         e.preventDefault();
//         e.stopImmediatePropagation();

//         // console.log(parentData);
//         Meteor.call('downvoteBroadcast', this._id);
//     },
//     'submit #reply-form' : function(e){
//         e.preventDefault();
//         e.stopImmediatePropagation();

//         var content = e.target.content.value;
//         Meteor.call('addReply', {
//             content: content,
//             broadcastId: this._id
//         });

//         e.target.content.value = '';
//     }
// });

// Template.reply.helpers({
//     'owner' : function(){
//         return Meteor.users.findOne(this.ownerId);
//     }
// });


// Template.reply.events({
//     'click #upvote' : function(e){
//         e.preventDefault();
//         e.stopImmediatePropagation();

//         var parentData = Template.parentData();
//         // console.log(parentData);
//         if(parentData != undefined){
//             Meteor.call('upvoteReply', parentData._id, this._id);
//         }
//     },
//     'click #downvote' : function(e){
//         e.preventDefault();
//         e.stopImmediatePropagation();

//         var parentData = Template.parentData();
//         // console.log(parentData);
//         if(parentData != undefined){
//             Meteor.call('downvoteReply', parentData._id, this._id);
//         }
//     }
// });

if(DEBUG){
    // log sent messages
    var _send = Meteor.connection._send;
    Meteor.connection._send = function (obj) {
        console.log("send", obj);
        _send.call(this, obj);
    };

    // log received messages
    Meteor.connection._stream.on('message', function (message) { 
        console.log("receive", JSON.parse(message)); 
    });
}