import { Service } from 'egg';

/**
 * Comment Service
 */
export default class CommentService extends Service {
  async save(userId, postId, content) {
    const { ctx } = this
    const post = await ctx.model.Post.findById(postId)
    const postRef = await ctx.model.Post.findById(postId).populate('user like').populate({ path: 'comment', populate: { path: 'user' } })
    const user = await ctx.model.User.findById(userId)
    if (post && user) {
      const comment = await new ctx.model.Comment({ user:userId, post:postId, content }).save()
      const commentRef = await ctx.model.Comment.findById(comment._id).populate('user')
      post.comment.push(comment._id)
      postRef.comment.push(commentRef)
      post.save()
    }
    ctx.body = {
      code: 0,
      msg: '评论添加成功',
      data: postRef
    }
  }
}
