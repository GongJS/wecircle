  
'use strict';
import { Application } from 'egg';

export default (app:Application) => {
  const { controller, router } = app;
   const auth = app.middleware.auth(app)
  // router.get('/', controller.home.index);
  router.post('/', controller.home.index);
  router.post('/api/verify_code',controller.user.verify_code);
  router.post('/api/login',controller.user.login);
  router.post('/api/upload', controller.upload.upload);
  router.post('/api/post/savepost',auth, controller.post.savepost);
  router.get('/api/post/getcirclepost', controller.post.getcirclepost);
  router.post('/api/post/like', auth, controller.post.like);
  router.post('/api/post/dislike', auth, controller.post.dislike);
  router.post('/api/savecomment', auth, controller.comment.saveComment);
  router.post('/api/updateuserinfo', auth, controller.user.updatUserInfo)
  router.post('/api/message/savemsg', auth, controller.message.saveMessage)
  router.post('/api/message/getchathistory', auth, controller.message.getchathistory)
  router.post('/api/getchatlist', auth, controller.chat.getchatlist)
};
