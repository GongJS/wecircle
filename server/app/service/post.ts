import { Service } from 'egg';

/**
 * User Service
 */
export default class UserService extends Service {
  async savepost(content, picList, myId) {
    const { ctx } = this
    await new ctx.model.Post({ content, picList, user:myId }).save()
    ctx.body = {
      code: 0,
      msg: '发布成功',
      result: {
        data: []
      }
    }
  }
  async getcirclepost(page: number, perPage: number) {
    const { ctx } = this
    const res = await ctx.model.Post.find().sort({_id: -1}).limit(perPage).skip(page * perPage).populate('user like').populate({ path: 'comment', populate: { path: 'user' } })
    ctx.body = {
      code: 0,
      msg: 'post获取成功',
      result: res
    }
  }
  async like(userId: string, postId: string) {
    const { ctx } = this
    const post = await ctx.model.Post.findById(postId)
    const postRef = await ctx.model.Post.findById(postId).populate('user like').populate({ path: 'comment', populate: { path: 'user' } })
    const user = await ctx.model.User.findById(userId)
    if (post && user) {
      if (!post.like.map(id => id.toString()).includes(userId)) {
        post.like.push(userId);
        postRef.like.push(user)
        post.save();
      }
    }
    ctx.body = {
      code: 0,
      msg: '点赞成功',
      data: postRef
    }
  }
  async dislike(userId: string, postId: string) {
    const { ctx } = this
    const post = await ctx.model.Post.findById(postId)
    const postRef = await ctx.model.Post.findById(postId).populate('user like').populate({ path: 'comment', populate: { path: 'user' } })
    const user = await ctx.model.User.findById(userId)
    if (post && user) {
      const index = post.like.map(id => id.toString()).indexOf(userId);
      if (index > -1) {
        post.like.splice(index, 1);
        postRef.like.splice(index, 1)
        post.save();
      }
    }
    ctx.body = {
      code: 0,
      msg: '取消点赞',
      data: postRef
    }
  }
}
