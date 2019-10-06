import { Service } from 'egg';

/**
 * User Service
 */
export default class UserService extends Service {
  async login(phone) {
    const { ctx, app } = this
    let user
    user = await ctx.model.User.findOne({ phone })
    if (!user) {
      const nickname = '用户' + Date.now();
      const avatar = 'http://101.132.117.183:7001/public/uploads/avatar/9a23d102-d709-45f9-9593-e4cea650f9aa.jpg';
      const bgurl = 'http://101.132.117.183:7001/public/uploads/bg/749feeb8-09a0-48fb-971d-2ac36968c8ff.jpg';
      const gender = '1';
      user = await new ctx.model.User({
        nickname,
        avatar,
        gender,
        bgurl,
        phone
      }).save()
    }
    const token = app.jwt.sign({ phone }, app.config.jwt.secret, { expiresIn: 4 * 60 * 60 });
    ctx.body = {
      code: 0,
      msg: '登录成功',
      result: {
        token,
        user
      }
    }
  }

  async update(key, value, phone) {
    const { ctx } = this
    const res = await ctx.model.User.update({ phone }, {
      $set:
        { [key]: value }
    }, { new: true })
    ctx.body = {
      code: 0,
      msg: '信息更新成功',
      [key]: res[key],
      data: res
    }
  }
  async search(keyword, myId) {
    const { ctx } = this
    const q = new RegExp(keyword);
    const list = await ctx.model.User.find({
      $or: [
        { phone: q },
        { nickname: q }
      ]
    })
    if (myId) {
      ctx.body = {
        code: 0,
        msg: '我的好友查找成功',
        data: list.filter(v => v._id.toString() === myId)
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '用户查找成功',
        data: list
      }
    }
  }
}
