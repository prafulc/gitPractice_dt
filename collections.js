Articles = new Meteor.Collection('articles')
Comments = new Meteor.Collection('comments')

Meteor.methods({
	addComment: function(articleId, comment){
		return Comments.insert({
			createdAt: new Date(),
			authorId: Meteor.userId(),
			articleId: articleId,
			comment: comment
		});
	}
})