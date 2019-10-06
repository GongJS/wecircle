  
'use strict';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1564023045455_9925';
  config.aliSMS = {
    accessKeyId: 'LTAIy2GZOwXe6TPB',
    accessKeySecret: '3aO0o2376aU3RU7VroYAhAeokf6rsh',
    regionId: 'cn-hangzhou',
    SignName: '盘影',
    TemplateCode: 'SMS_157680540'
  };
  config.mongoose = {
    //url: 'mongodb+srv://gongjs:gong778899@zhihu-1gwpe.mongodb.net/circle?retryWrites=true&w=majority',
    url: 'mongodb://gongjs:778899@localhost/wecircle'
  };

  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'seds123',
      db: 0,
    }
  };
  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: [],
      },
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      auth_pass: 'seds123',
      db: 0,
    },
  };
  config.jwt = {
    secret: 'egg-circle-jwt'
  };
  config.security = {
    csrf: {
      enable: false
    }
  };
  config.cors = {
    origin: '*',
    // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  config.jwt = {
    secret: 'egg-circle-jwt'
  };
  config.multipart = {
    mode: 'file',
  };
  config.onerror = {
    json(err, ctx) {
      console.log('err:',err)
      switch (err.code) {
        case 'invalid_param':
          ctx.body = { msg: err.errors[0].message, code: 777 }
          ctx.status = 422
          break;
        default:
          ctx.body = { msg: '未知错误', code: -1 }
          ctx.status = 500
      }
    },
  };
  // add your egg config in here
  config.middleware = []
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
