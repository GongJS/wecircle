import { Controller } from 'egg';

export default class ChatController extends Controller {
  async getlist() {
    const { ctx } = this;
    const keyword = ctx.request.body.keyword || ''
    const myId = ctx.request.body.myId
    const createRule = {
      myId: { type: 'string', required: true },
    };
    ctx.validate(createRule);
    await ctx.service.chat.getlist(keyword, myId)
  }
}  
