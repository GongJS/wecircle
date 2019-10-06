// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAlismsService from '../../../app/service/alismsService';
import ExportChat from '../../../app/service/chat';
import ExportComment from '../../../app/service/comment';
import ExportMessage from '../../../app/service/message';
import ExportPost from '../../../app/service/post';
import ExportRequest from '../../../app/service/request';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    alismsService: ExportAlismsService;
    chat: ExportChat;
    comment: ExportComment;
    message: ExportMessage;
    post: ExportPost;
    request: ExportRequest;
    user: ExportUser;
  }
}
