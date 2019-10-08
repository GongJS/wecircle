module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const RequestSchema = new Schema({
    content: { type: String },// 请求内容
    status:{ type: String, enum: ['agree', 'pending', 'reject'],default: 'pending'},// 请求结果
    fromUser:{ type: Schema.Types.ObjectId, ref: 'User',required:true },//聊天的发起者
    toUser:{ type: Schema.Types.ObjectId, ref: 'User',required:true },//聊天的接收者
    create: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now },
  }, { timestamps: { createdAt: 'create', updatedAt: 'update' } });
  return mongoose.model('Request', RequestSchema);
}