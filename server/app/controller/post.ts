import { Controller } from 'egg';

export default class PostController extends Controller {
  public async savepost() {
    const { ctx } = this;
    const content = ctx.request.body.content
    const picList = ctx.request.body.picList
    const myId = ctx.request.body.myId
    const createRule = {
      content: { type: 'string' , required: true},
      picList: { type: 'array' },
      myId: { type: 'string', required: true }
    };
    ctx.validate(createRule);
    await ctx.service.post.savepost(content, picList, myId)
  }  
  public async getcirclepost() {
    const { ctx } = this;
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    await ctx.service.post.getcirclepost(page, perPage)
  }

  public async like() {
    const { ctx } = this;
    const userId = ctx.request.body.userId
    const postId = ctx.request.body.postId
    const createRule = {
      userId: { type: 'string', required: true },
      postId: { type: 'string', required: true }
    };
    ctx.validate(createRule);
    await ctx.service.post.like(userId, postId)
  }
  public async dislike() {
    const { ctx } = this;
    const userId = ctx.request.body.userId
    const postId = ctx.request.body.postId
    const createRule = {
      userId: { type: 'string', required: true },
      postId: { type: 'string', required: true }
    };
    ctx.validate(createRule);
    await ctx.service.post.dislike(userId, postId)
  }
}
