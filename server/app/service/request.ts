import { Service } from 'egg';

/**
 * Request Service
 */

export default class RequestService extends Service {
  async getlist(myId) {
    const { ctx } = this
    const toUser = await ctx.model.User.findById(myId)
    if (!toUser) {
      ctx.body = {
        code: -1,
        msg: '用户不存在'
      }
    } else {
      const list = await ctx.model.Request.find({ toUser: myId }).populate('fromUser').sort({ 'create': -1 }).exec()
      ctx.body = {
        code: 0,
        msg: '好友请求列表获取成功',
        data: list
      }
    }
  }
  async addfriend(content, toUserId, myId) {
    const { ctx } = this
    const my = await ctx.model.User.findById(myId)
    const toUser = await ctx.model.User.findById(toUserId)
    if (!my || !toUser) {
      ctx.body = {
        code: -1,
        msg: '用户不存在',
      }
    }
    const request: any = await ctx.model.Request.find({ toUser: toUserId, fromUser: myId })
    for (let i = 0; i < request.length; i++) {
      if (request[i].status === 'pending') {
        ctx.body = {
          code: 0,
          msg: ''
        }
        return
      }
    }
    await new ctx.model.Request({ content, toUser: toUserId, fromUser: myId }).save()
    ctx.body = {
      code: 0,
      msg: '添加好友请求发送成功'
    }
  }
  async agree(myId, fromUserId, requestId) {
    const { ctx } = this
    const my = await ctx.model.User.findById(requestId)
    const toUser = await ctx.model.User.findById(requestId)
    const request = await ctx.model.Request.findById(requestId)
    if (!request && !my && !toUser) {
      ctx.body = {
        code: -1,
        msg: '用户或者请求不存在'
      }
    } else {
      const user = await ctx.model.User.findById(myId)
      if (!user.friend.map(id => id.toString()).includes(fromUserId)) {
        user.friend.push(fromUserId);
        user.save();
        await ctx.model.Request.update({ _id: requestId }, {
          $set:
            { status: 'agree' }
        }, { new: true })
        ctx.body = {
          code: 0,
          msg: '添加好友成功'
        }
      } else {
        ctx.body = {
          code: -1,
          msg: '该好友已存在'
        }
      }
    }
  }
  async reject(requestId) {
    const { ctx } = this
    const request = await ctx.model.Request.findById(requestId)
    if (!request) {
      ctx.body = {
        code: -1,
        msg: '请求不存在'
      }
    } else {
      await ctx.model.Request.update({ _id: requestId }, {
        $set:
          { status: 'reject' }
      }, { new: true })
      ctx.body = {
        code: 0,
        msg: '拒绝添加好友成功'
      }
    }
  }
}