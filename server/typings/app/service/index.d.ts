// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAlismsService from '../../../app/service/AlismsService';
import ExportUser from '../../../app/service/User';
import ExportChat from '../../../app/service/chat';
import ExportComment from '../../../app/service/comment';
import ExportMessage from '../../../app/service/message';
import ExportPost from '../../../app/service/post';

declare module 'egg' {
  interface IService {
    alismsService: ExportAlismsService;
    user: ExportUser;
    chat: ExportChat;
    comment: ExportComment;
    message: ExportMessage;
    post: ExportPost;
  }
}
