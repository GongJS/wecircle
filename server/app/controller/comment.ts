import { Controller } from 'egg';

export default class CommentController extends Controller {
  async saveComment() {
    const { ctx } = this;
    const userId = ctx.request.body.userId
    const postId = ctx.request.body.postId
    const content = ctx.request.body.content
    const createRule = {
      userId: { type: 'string', required: true },
      postId: { type: 'string', required: true },
      content: { type: 'string', required: true },
    };
    ctx.validate(createRule);
    await ctx.service.comment.saveComment(userId, postId, content)
  }
}