export default function auth() {
  return async (ctx, next) => {
    const { app,socket} = ctx;
    // 用户信息
    //用户进入聊天页面代表登录
    socket.on('login', async (obj) => {
      console.log('用户' + obj._id + '进入聊天页面')
      //将用户id和当前用户的socket存起来
      const id = socket.id;
      await app.redis.set(`${obj._id}:${id}`);
    });

    //用户离开聊天页面代表登出
    socket.on('loginout', async (obj) => {
      console.log('用户' + obj._id + '离开聊天页面')
      //将该用户从用户池中删除
      app.redis.del(`${obj._id}`)
    });
    await next();
  }
}
