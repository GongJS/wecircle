module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const MessageSchema = new Schema({
    content: { type: Schema.Types.Mixed },//聊天内容
    fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },//发送者
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },//聊天id关联
    toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },//接收者
    create: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now },
  }, { timestamps: { createdAt: 'create', updatedAt: 'update' } });
  return mongoose.model('Message', MessageSchema);
}
