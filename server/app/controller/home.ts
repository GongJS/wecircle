import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx, app } = this;
    const phone = ctx.request.body.phone
    //ctx.body = await ctx.service.best.sendSMS('15563882537', '4532');
    const EXPIRE = 5 * 60 * 1000 // 默认5分钟过期时间
    const code =  ctx.helper.generateCode()
    const expire = new Date().getTime() + EXPIRE
    const saveExpire:string | null= await app.redis.hget(`phone:${phone}`, 'expire')
    if (saveExpire && new Date().getTime() - parseInt(saveExpire) < 1 * 60 * 1000) {
      ctx.body = {
        code: -1,
        msg: '请求过于频繁，请1分钟后再试'
      }
      return false
    }
    await ctx.service.alismsService.sendSMS(phone, code);
    app.redis.hmset(`phone:${phone}`, 'code', code, 'expire', expire)
    app.redis.expire(`phone:${phone}`, EXPIRE / 1000) // 设置redis失效时间
  }
}
