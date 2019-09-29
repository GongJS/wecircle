import { Controller } from 'egg';

export default class UserController extends Controller {
  public async verify_code() {
    const { ctx, app } = this;
    const phone = ctx.request.body.phone
    const createRule = {
      phone: { type: 'string', required: true, max: 11, min: 11 },
    };
    ctx.validate(createRule);
    const EXPIRE = 155 * 60 * 1000 // 默认5分钟过期时间
    const code = ctx.helper.generateCode()
    const expire = new Date().getTime() + EXPIRE
    const saveExpire: string | null = await app.redis.hget(`phone:${phone}`, 'expire')
    if (saveExpire && ( parseInt(saveExpire) - new Date().getTime() > 4 * 60 * 1000 &&  parseInt(saveExpire) - new Date().getTime() < 5 * 60 * 1000)) {
      ctx.body = {
        code: -1,
        msg: '请求过于频繁，请1分钟后再试'
      }
      return false
    }
    const res = await ctx.service.alismsService.sendSMS(phone, code)
    if (res.code === 0) {
      {
      ctx.body = { code: 0, msg: '验证码发送成功，请注意查收' }
        await app.redis.hmset(`phone:${phone}`, 'code', code, 'expire', expire)
        await app.redis.expire(`phone:${phone}`, EXPIRE / 1000)
      }// 设置redis失效时间
    } else {
      ctx.body = { code: -1, msg: res.Message }
    }
  }
  public async login() {
    const { ctx, app } = this;
    const phone = ctx.request.body.phone
    const code = ctx.request.body.code
    const createRule = {
      phone: { type: 'string', required: true, max: 11, min: 11 },
      code: { type: 'string', required: true, max: 4, min: 4 },
    };
    ctx.validate(createRule);
    const saveCode = await app.redis.hget(`phone:${phone}`, 'code')
    if (code === saveCode) {
      await ctx.service.user.login(phone)
    } else {
      ctx.body = {
        code: -1,
        msg: '验证码无效或已过期'
      }
    }
  }
 
  public async updatUserInfo() {
    const { ctx } = this;
    const key = ctx.request.body.key
    const value = ctx.request.body.value
    const phone = ctx.request.body.phone
    const createRule = {
      key: { type: 'string', required: true },
      value: { type: 'string', required: true },
      phone: { type: 'string', required: true, max: '11', min: '11' },
    };
    ctx.validate(createRule);
    await ctx.service.user.updatUserInfo(key,value,phone)
  }
}