
const jsonwebtoken = require('jsonwebtoken')
module.exports = (app) => {
  return async function auth(ctx, next) {
    const { authorization = '' } = ctx.request.header
    const token = authorization.replace('Bearer ', '')
    try {
      jsonwebtoken.verify(token, app.config.jwt.secret)
    } catch (err) {
      // token无效
      if (err.name === 'JsonWebTokenError') {
        ctx.status = 401
        ctx.body = {
          code: 888,
          msg: err.message,
        }
        return
      }
      // token过期
      if (err.name === 'TokenExpiredError') {
        ctx.status = 401
        const phone = ctx.request.body.phone
        const newToken = app.jwt.sign({ phone }, app.config.jwt.secret, { expiresIn: "2h" });
        ctx.body = {
          code: 999,
          msg: err.message,
          phone,
          token:newToken
        }
        return
      }
    }
    await next();
  }
}
