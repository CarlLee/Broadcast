
var cx = React.addons.classSet;

BroadcastList =  React.createClass({
    mixins: [ReactMeteorData],
    getInitialState: function(){
        return {
            expanded: false
        }
    },
    getMeteorData: function(){
        Meteor.subscribe('broadcasts');
        return {
            broadcasts : Broadcasts.find().fetch()
        }
    },

    render: function(){
        var self = this;
        var broadcasts = this.data.broadcasts;
        var classNames = {
            expanded: this.state.expanded,
            broadcasts: true
        };
        return (
            <div className={cx(classNames)}>
                {broadcasts.map(function(broadcast) {
                    console.log('broadcast', broadcast);
                    return <Broadcast broadcast={broadcast} key={broadcast._id} />;
                })}
            </div>
        );
    }
});

Broadcast = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function(){
        return {
            user: Meteor.user()
        }
    },
    toggleExpanded: function(){
        console.log('Broadcast.toggleExpanded');
        var expanded = !this.expanded;
        var prevExpanded = this.expanded;
        var container = React.findDOMNode(this.refs.container);
        var prevStyles = this.prevStyles || {};
        if(expanded){
            var rect = container.getBoundingClientRect();
            var parentRect = container.parentElement.getBoundingClientRect();
            var offset = rect.top - parentRect.top;
            var top = offset + 'px';
            var height = rect.height + 'px';

            container.style['top'] = top;
            container.style['height'] = height;
            $(container).addClass('expanded');
            $(container).animate({
                top: '0',
                height: '100%'
            }, 300, "swing");

            prevStyles['top'] = top;
            prevStyles['height'] = height;
            this.prevStyles = prevStyles;
            console.log('expanding');
        }else if(prevExpanded === true){
            console.log('collapsing');
            $(container).addClass('collapsing');
            $(container).animate({
                top: prevStyles['top'],
                height: prevStyles['height']
            }, 300, "swing", function(){
                $(container).removeClass('collapsing');
                $(container).removeClass('expanded');
                container.style.removeProperty('top');
                container.style.removeProperty('height');
            });
            // setTimeout(function(){
            //     $(container).removeClass('collapsing');
            //     $(container).removeClass('expanded');
            //     container.style.removeProperty('top');
            //     container.style.removeProperty('height');
            // }, 3000);
        }
        this.expanded = expanded;
    },
    render: function(){
        console.log('Broadcast.render');
        var user = this.data.user;
        var broadcast = this.props.broadcast;
        return (
            <div className="broadcast" ref="container">
                <div onClick={this.toggleExpanded}>
                    <BroadcastContent broadcast={broadcast}/>
                </div>
                <div>
                    <ReplyList broadcast={broadcast}/>
                    { user == undefined ? '' : <ReplyInput broadcast={broadcast} /> }
                </div>
            </div>
        )
    }
});

BroadcastContent = React.createClass({
    mixins: [ReactMeteorData],
    componentDidMount: function(){
    },
    getMeteorData: function(){
        var broadcast = this.props.broadcast;
        return {
            repliesCnt : Replies.find({
                broadcastId: broadcast._id
            }).count(),
            owner : Meteor.users.findOne(broadcast.ownerId)
        }
    },
    render: function(){
        var broadcast = this.props.broadcast;
        var ago = moment(broadcast.created).fromNow();
        var owner = this.data.owner;
        var repliesCnt = this.data.repliesCnt;
        console.log('BroadcastContent.render');
        console.log('owner', owner);
        console.log('repliesCnt', repliesCnt);
        return (
            <div className="broadcast-content">
                <div className="user-info">
                    <div className="avatar-wrapper">
                        <img src={ owner.profile.avatar } className="avatar" />
                    </div>
                </div>
                <div className="info">
                    <div className="title">
                        <span>{ broadcast.title } </span>
                        <span className="sub-text">
                            <a id="upvote" href="#" className="votes">&#9650;</a>
                            <a id="downvote" href="#" className="votes">&#9660;</a>
                            <span> { broadcast.votes } votes</span>
                        </span>
                    </div>
                    <div className="etc sub-text">
                        <span>by <a className="owner" href="#">{ owner.profile.nickname }</a></span>
                        <span> from { owner.profile.location }, { ago }</span>
                    </div>
                </div>
                <div className="details">{ broadcast.content }</div>
                <div className="replies_count">{ repliesCnt }</div>
            </div>
        );
    }
});

ReplyList = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function(){
        var broadcastId = this.props.broadcast._id;
        return {
            replies: Replies.find({
                broadcastId: broadcastId
            },{
                sort: {
                    created: -1
                }
            }).fetch()
        }
    },
    render: function(){
        console.log('ReplyList.render');
        var replies = this.data.replies;
        return (
            <div className="replies">
                {replies.map(function(reply){
                    return <Reply key={reply._id} reply={reply}/>
                })}
            </div>
        )
    }
});

Reply = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function(){
        var ownerId = this.props.reply.ownerId;
        return {
            owner: Meteor.users.findOne(ownerId)
        }
    },
    render: function(){
        console.log('Reply.render');
        var reply = this.props.reply;
        var ago = moment(reply.created).fromNow();
        var owner = this.data.owner;

        return (
            <div className="reply clearfix">
                <div className="user-info">
                    <div className="avatar-wrapper">
                        <img src={ owner.profile.avatar } className="avatar" />
                    </div>
                </div>
                <div className="reply-details">
                    <div className="reply-etc sub-text">
                        <a className="owner" href="#">{ owner.profile.nickname }</a>
                        <span> from { owner.profile.location }, { ago } </span>
                        <a href="#" id="upvote" className="votes">&#9650;</a>
                        <a href="#" id="downvote" className="votes">&#9660;</a>
                        <span> { reply.votes } votes</span>
                    </div>
                    <div className="content">{ reply.content }</div>
                </div>
            </div>
        )
    }
});

ReplyInput = React.createClass({
    mixins: [ReactMeteorData],
    getInitialState: function(){
        return {
            expanded: false
        }
    },
    getMeteorData: function(){
        return {
            myself: Meteor.user()
        }
    },
    onClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.toggleExpanded();
    },
    onSubmit: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.addReply();
    },
    onKeyDown: function(e){
        if(e.keyCode == 13 && e.ctrlKey){
            e.preventDefault();
            e.stopPropagation();
            this.addReply();
        }
    },
    toggleExpanded: function(){
        var container = React.findDOMNode(this.refs.container);
        $(container).toggleClass('footer-expanded');
        this.setState({
            expanded: !this.state.expanded
        });
    },
    addReply: function(){
        var input = React.findDOMNode(this.refs.input);
        var broadcast = this.props.broadcast;
        Meteor.call('addReply', {
            broadcastId: broadcast._id,
            content: input.value
        });
        input.value = '';
    },
    render: function(){
        var myself = this.data.myself;
        var owner = myself;
        return (
            <form onSubmit={this.onSubmit} id="reply-form" className="reply-form" ref="container">
                <a href="#" onClick={this.onClick} className="expander">{this.state.expanded ? "▼": "▲"}</a>
                <div className="wrapper">
                    <textarea onKeyDown={this.onKeyDown} ref="input" placeholder={"Reply to " + owner.profile.nickname + " here"} className="reply-content" name="content" id="reply-content"></textarea>
                </div>
                <div className="buttons">
                    <button className="primary">Reply</button>
                </div>
            </form>
        )
    }
});
