import { Controller } from 'egg';

export default class MessageController extends Controller {
  public async save() {
    const { ctx } = this;
    const myId = ctx.request.body.myId
    const content = JSON.parse(ctx.request.body.content)
    console.log(typeof(content))  
    const toUserId = ctx.request.body.toUserId
    const createRule = {
      myId: { type: 'string', required: true },
     //  content: { type: 'object', required: true },
      toUserId: { type: 'string', required: true },
    };
    ctx.validate(createRule);
    await ctx.service.message.save(myId, content, toUserId)
  }
  public async gethistory() {
    const { ctx } = this;
    const myId = ctx.request.body.myId
    const toUserId = ctx.request.body.toUserId
    const createRule = {
      myId: { type: 'string', required: true },
      toUserId: { type: 'string', required: true },
    };
    ctx.validate(createRule);
    await ctx.service.message.gethistory(myId, toUserId)
  }
}
