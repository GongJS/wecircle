// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportChat from '../../../app/model/chat';
import ExportComment from '../../../app/model/comment';
import ExportMessage from '../../../app/model/message';
import ExportPost from '../../../app/model/post';
import ExportRequest from '../../../app/model/request';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Chat: ReturnType<typeof ExportChat>;
    Comment: ReturnType<typeof ExportComment>;
    Message: ReturnType<typeof ExportMessage>;
    Post: ReturnType<typeof ExportPost>;
    Request: ReturnType<typeof ExportRequest>;
    User: ReturnType<typeof ExportUser>;
  }
}
