Meteor.publish('Articles', function(){
	return Articles.find();
});

Meteor.publish('Comments', function(){
	return Comments.find();
});

Meteor.publishComposite('TopArticles', {
	find: function(){
		return Articles.find();
	},
	children: [{
		find: function(article){
			return Meteor.users.find(article.authorId, {fields:{username:1, emails:1}});
		},	
	},{
		find: function(article){
			return Comments.find({articleId: article._id});
		},
		children: [{
			find: function(comment, article){
				return Meteor.users.find(comment.authorId, {fields:{username:1, emails:1}});
			},	
		}]	
	}]
})