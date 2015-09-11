CONGFIG = {
	// The ratio for calculating rank
	VOTE_TIME_RATIO : 15 * 60
}

Meteor.publishComposite('broadcasts', {
    find: function() {
        return Broadcasts.find({}, { sort: { created: -1 }, limit: 10 });
    },
    children: [
        {
            find: function(broadcast) {
                return Meteor.users.find(
                    { _id: broadcast.ownerId },
                    { limit: 1, fields: { profile: 1 } });
            }
        },
        {
            find: function(broadcast) {
                return Replies.find(
                    { broadcastId: broadcast._id },
                    { sort: { created: -1 }});
            },
            children: [
                {
                    find: function(reply, broadcast) {
                        return Meteor.users.find(
                            { _id: reply.ownerId },
                            { limit: 1, fields: { profile: 1 } });
                    }
                }
            ]
        }
    ]
});

Meteor.methods({
	addBroadcast: function(broadcast){
		Broadcasts.insert({
			'ownerId' : Meteor.userId(),
			'content' : broadcast.content,
			'title'   : broadcast.title,
			'created' : new Date(),
			'votes'   : 0
		});
	},
	addReply: function(reply){
		Replies.insert({
			'broadcastId': reply.broadcastId,
			'ownerId'    : Meteor.userId(),
			'content'    : reply.content,
			'created'    : new Date(),
			'votes'      : 0
		});
	},
	upvoteReply: function(broadcastId, replyId){
		Replies.update({
			'_id' : replyId
		}, {
			$inc : {
				"votes": 1
			}
		});
	},
	downvoteReply: function(broadcastId, replyId){
		Replies.update({
			'_id' : replyId,
		}, {
			$inc : {
				"votes": -1
			}
		});
	},
	upvoteBroadcast: function(broadcastId){
		Broadcasts.update({
			'_id' : broadcastId
		}, {
			$inc : {
				"votes": 1
			}
		});
	},
	downvoteBroadcast: function(broadcastId){
		Broadcasts.update({
			'_id' : broadcastId
		}, {
			$inc : {
				"votes": -1
			}
		});
	},
});

