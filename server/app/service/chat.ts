import { Service } from 'egg';

/**
 * Chat Service
 */



export default class ChatService extends Service {
  async getMsgByChat (chat,keyword){
    const { ctx } = this
    const reg = new RegExp(keyword, 'i')
    const list = await ctx.model.Message.find({
      chat:chat._id,
      'content.type':'str',
      'content.value': {
        $regex: reg
      }
    }).sort({'create':-1}).exec();
    return list[0] || false
  }
  async getchatlist(keyword, myId) {
    const { ctx } = this
    const list = await ctx.model.Chat.find({
      $or:[
        { fromUser: myId},
        { toUser: myId}
        ]
      }).populate('fromUser').populate('toUser').sort({'create':-1}).exec()
    const result:any[] = [];
    for (var i = 0 ; i < list.length ; i++) {
      //todo why parse
      var chat = JSON.parse(JSON.stringify(list[i]));

      //根据chat的id，找到对应的消息列表里的第一条消息内容
      chat.msg = await this.getMsgByChat(list[i],keyword);

      //找到消息就push数组
      if (chat.msg) {
        var user = {};
        if (chat.toUser._id == myId) {
          user = chat.fromUser;
        } else {
          user = chat.toUser;
        }
        chat.user = user;
        result.push(chat);
      }
    }
    ctx.body = {
      code: 0,
      msg: '评论添加成功',
      data: result
    }
  }
}