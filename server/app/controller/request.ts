import { Controller } from 'egg';

export default class RequestController extends Controller {
  public async addfriend() {
    const { ctx } = this;
    const content = ctx.request.body.content
    const toUserId = ctx.request.body.toUserId
    const myId = ctx.request.body.myId
    const createRule = {
      content: { type: 'string', required: true },
      toUserId: { type: 'string', required: true },
      myId: { type: 'string', required: true }
    };
    ctx.validate(createRule);
    await ctx.service.request.addfriend(content, toUserId, myId)
  }
  public async getlist() {
    const { ctx } = this;
    const myId = ctx.request.body.myId
    const createRule = {
      myId: { type: 'string', required: true }
    };
    ctx.validate(createRule);
    await ctx.service.request.getlist(myId)
  }
  public async agree() {
    const { ctx } = this;
    const myId = ctx.request.body.myId
    const fromUserId = ctx.request.body.fromUserId
    const requestId = ctx.request.body.requestId
    const createRule = {
      myId: { type: 'string', required: true },
      fromUserId: { type: 'string', required: true },
      requestId: { type: 'string', required: true }
    };
    ctx.validate(createRule);
    await ctx.service.request.agree(myId, fromUserId, requestId)
  }
  public async reject() {
    const { ctx } = this;
    const requestId = ctx.request.body.requestId
    const createRule = {
      requestId: { type: 'string', required: true }
    };
    ctx.validate(createRule);
    await ctx.service.request.reject(requestId)
  }
}
