  
'use strict';
import { Application } from 'egg';

export default (app:Application) => {
  const { controller, router } = app;
   const auth = app.middleware.auth(app)
  // router.get('/', controller.home.index);
  router.post('/', controller.home.index);
  router.post('/api/user/verify_code',controller.user.verify_code);
  router.post('/api/user/login',controller.user.login);
  router.post('/api/user/search',controller.user.search);
  router.post('/api/user/update', auth, controller.user.update)
  router.post('/api/upload', controller.upload.upload);
  router.post('/api/comment/save', auth, controller.comment.save);
  router.post('/api/post/savepost',auth, controller.post.savepost);
  router.get('/api/post/getpost', controller.post.getpost);
  router.post('/api/post/like', auth, controller.post.like);
  router.post('/api/post/dislike', auth, controller.post.dislike);
  router.post('/api/message/save', auth, controller.message.save)
  router.post('/api/message/gethistory', auth, controller.message.gethistory)
  router.post('/api/chat/getlist', auth, controller.chat.getlist)
  router.post('/api/request/addfriend', auth, controller.request.addfriend)
  router.post('/api/request/getlist', auth, controller.request.getlist)
  router.post('/api/request/agree', auth, controller.request.agree)
  router.post('/api/request/reject', auth, controller.request.reject)
};
