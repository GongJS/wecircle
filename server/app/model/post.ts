module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    content: { type: String, required:true},
    picList: { type: Schema.Types.Mixed },
    create: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now },
    user:{ type: Schema.Types.ObjectId, ref: 'User',required:true },
    like: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    comment: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    },
  },{timestamps:{createdAt: 'create',updatedAt:'update'}});
  return mongoose.model('Post', PostSchema);
}