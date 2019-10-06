import { Service } from 'egg';

/**
 * Message Service
 */
export default class MessageService extends Service {
  async addMsg(myId, content, toUserId) {
    const { ctx } = this
    let chatId = '';
    //首先需要查询是否已经有过聊天
    const list = await ctx.model.Chat.find({
      $or: [
        { $and: [{ fromUser: myId }, { toUser: toUserId }] },
        { $and: [{ fromUser: toUserId }, { toUser: myId }] }
      ]
    }).sort({ 'create': 1 }).exec();

    //如果有就把chatId记录下来
    if (list.length) {
      chatId = list[0]._id;
    } else {
      const chat = await new ctx.model.Chat({
        params: {
          users: [myId, toUserId]
        },
        fromUser: myId,
        toUser: toUserId,
      }).save();
      chatId = chat._id;
    }

    //添加一条消息
    const result = await new ctx.model.Message({
      content: content,
      fromUser: myId,//发送者的id，也就是当前登录用户的id
      chat: chatId,//将之前的chatId外键存入的message里
      toUser: toUserId,//接收者的ID
    }).save();

    // 更新chat的最新一条消息时间
    await ctx.model.Chat.findByIdAndUpdate(chatId, {
      lastMsgTime: result.create
    }).exec()

    return result
  }
  async save(myId, content, toUserId) {
    const { ctx, app } = this
    const my = await ctx.model.User.findById(myId)
    const toUser = await ctx.model.User.findById(toUserId)
    if (my && toUser) {
      const result = await this.addMsg(myId, content, toUserId);
      //消息创建成功
      if (result._id) {
        //消息通知逻辑    Todo

        //把用户详细查询出来
        var user = await ctx.model.User.findById(result.fromUser).exec();
        //socket实时消息
        const socket_id = await app.redis.get(`${toUserId}`)
        console.log(app.io.to(socket_id!))
        app.io.to(app.redis.get(socket_id!)).emit('recieveMsg', { content: result.content, fromUser: user });
        ctx.body = {
          code: 0,
          msg: '发送成功'
        }
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '用户不存在',
      }
    }
  }
  async gethistory(myId, toUserId) {
    const { ctx } = this
    const list = await ctx.model.Message.find({
      $or: [
        { $and: [{ fromUser: myId }, { toUser: toUserId }] },
        { $and: [{ fromUser: toUserId }, { toUser: myId }] }
      ]
    }).populate('fromUser').sort({ 'create': 1 }).exec()
    const result: any[] = [];
    for (var i = 0; i < list.length; i++) {
      var msg = JSON.parse(JSON.stringify(list[i]));
      //如果发送者id和当前登录用户id相等，表示出主人态
      if (myId == msg.fromUser._id) {
        msg.mine = true;
      } else {
        msg.mine = false;
      }
      result.push(msg);
    }
    ctx.body = {
      code: 0,
      msg: '聊天记录获取成功',
      data: result
    }
  }
} 
