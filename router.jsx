/* New Comment Added */
FlowRouter.route('/',{
  name: 'home',
  subscriptions: function(){
    // this.register('articles', Meteor.subscribe('Articles'));
    this.register('topTen', Meteor.subscribe('TopArticles'));
  },
  action: function() {
    ReactLayout.render(MainLayout, {content: <ListArticles />} )
  },
  triggersEnter: [function(context){ console.log(context)}]
})

var userRoute = FlowRouter.group({
  prefix: '/user',
  name: 'user',
  triggersEnter:[function(context, redirect){
    console.log(context)
    if(Meteor.user()){
      // redirect('home')
    }
  }]
})

userRoute.route('/',{
  name: 'userArea',
  subscriptions: function(){
    this.register('topTen', Meteor.subscribe('TopArticles'));
  },
  action: function(){
    ReactLayout.render(MainLayout, {content: <ListArticles />} )
  }
})

userRoute.route('/view',{
  name: 'userView',
  subscriptions: function(){
    this.register('topTen', Meteor.subscribe('TopArticles'));
  },
  action: function(){
    ReactLayout.render(MainLayout, {content: <ListArticles />} )
  }
})

ListArticles = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    return {
      articles: Articles.find().fetch()
    }
  },
  render(){
    return (
      <div>
        {this.data.articles.map(function(article){
          return <ShortArticle key={article._id} article={article} />
        })}
      </div>
    );
  }
})

MainLayout = React.createClass({
  render(){
    return(
      <div>
        <h1>Blog Site Title</h1>
        <main>
          {this.props.content}
        </main>
        <hr />
        <footer>
          <div>Copyright &copy; Site Footer.</div>
        </footer>
      </div>
    )
  }
})

ShortArticle = React.createClass({
  prototype: {
    article: React.PropTypes.object.isRequired
  },
  mixins: [ReactMeteorData],
  getMeteorData(){
    return {
      author: Meteor.users.find(this.props.article.authorId).fetch()
    }
  },
  render(){
    return (
      <div>
        <h3>{this.props.article.title} - <small>{this.data.author.map(function(auth){
          return auth.username
        })}</small></h3>
        <div dangerouslySetInnerHTML={{__html:this.props.article.body}} />
        <CommentList articleId={this.props.article._id} />
      </div>
    )
  }
})

CommentList = React.createClass({
  prototype: {
    articleId: React.PropTypes.string.isRequired
  },
  mixins: [ReactMeteorData],
  getMeteorData(){
    return {
      comments: Comments.find({articleId:this.props.articleId}).fetch()
    }
  },
  render(){
    return (
      <div>
        {this.data.comments.map(function(comment){
          return <Comment key={comment._id} comment={comment} />
        })}
        <CommentForm articleId={this.props.articleId} />
      </div>
    )
  }
})

Comment = React.createClass({
  prototype: {
    comment: React.PropTypes.object.isRequired
  },
  mixins: [ReactMeteorData],
  getMeteorData(){
    return {
      author: Meteor.users.find(this.props.comment.authorId).fetch()
    }
  },
  render(){
    return(
      <div>
        {this.props.comment.comment} - <small><strong><em>{this.data.author.map(function(auth){
          return auth.username
        })}</em></strong></small>
      </div>
    )
  }
})

CommentForm = React.createClass({
  postComment(event){
    event.preventDefault();
    var comment = ReactDOM.findDOMNode(this.refs.comment).value.trim()
    var articleId = this.props.articleId
    Meteor.call('addComment', articleId, comment, function(err, data){
      if(err)
        console.error(err)
      else console.log(data)
    })
    ReactDOM.findDOMNode(this.refs.comment).value = ''
  },
  render(){
    return (
      <div>
        <form onSubmit={this.postComment} method="POST">
          <input type="text" ref="comment" />
        </form>
      </div>
    )
  }
})
