// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportChat from '../../../app/controller/chat';
import ExportComment from '../../../app/controller/comment';
import ExportHome from '../../../app/controller/home';
import ExportMessage from '../../../app/controller/message';
import ExportPost from '../../../app/controller/post';
import ExportRequest from '../../../app/controller/request';
import ExportUpload from '../../../app/controller/upload';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    chat: ExportChat;
    comment: ExportComment;
    home: ExportHome;
    message: ExportMessage;
    post: ExportPost;
    request: ExportRequest;
    upload: ExportUpload;
    user: ExportUser;
  }
}
